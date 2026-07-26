[CmdletBinding()]
# Run this helper from the canonical short-path checkout: C:\Users\steve\TechSubbies.
param(
    [ValidateSet("Setup", "Check", "Test", "Audit", "Dev", "All")]
    [string]$Task = "Check",

    [switch]$SkipInstall,

    [switch]$IncludeGemini
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptRoot = Split-Path -Parent $PSCommandPath
$RepositoryRoot = [System.IO.Path]::GetFullPath((Join-Path $ScriptRoot ".."))
$BackendRoot = Join-Path $RepositoryRoot "backend"
$FrontendEnvironment = Join-Path $RepositoryRoot ".env.local"
$BackendEnvironment = Join-Path $BackendRoot ".env"

function Write-Step {
    param([Parameter(Mandatory)][string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Assert-Command {
    param([Parameter(Mandatory)][string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found on PATH."
    }
}

function Invoke-Npm {
    param(
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [Parameter(Mandatory)][string[]]$Arguments,
        [switch]$AllowFailure
    )

    Push-Location $WorkingDirectory
    try {
        & npm @Arguments
        $ExitCode = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }

    if ($ExitCode -ne 0 -and -not $AllowFailure) {
        throw "npm $($Arguments -join ' ') failed in '$WorkingDirectory' with exit code $ExitCode."
    }

    if ($AllowFailure) {
        return $ExitCode
    }
}

function New-SecureSecret {
    $Bytes = [byte[]]::new(48)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($Bytes)
    return [Convert]::ToBase64String($Bytes)
}

function Initialize-Environment {
    Write-Step "Preparing local environment files"

    if (-not (Test-Path -LiteralPath $FrontendEnvironment)) {
        Copy-Item -LiteralPath (Join-Path $RepositoryRoot ".env.local.example") -Destination $FrontendEnvironment
        Write-Host "Created .env.local from its example."
    }
    else {
        Write-Host ".env.local already exists; leaving it unchanged."
    }

    if (-not (Test-Path -LiteralPath $BackendEnvironment)) {
        $BackendTemplate = Get-Content -Raw -LiteralPath (Join-Path $BackendRoot ".env.example")
        $BackendTemplate = $BackendTemplate.Replace(
            'JWT_SECRET="change-this-to-a-long-random-string"',
            ('JWT_SECRET="{0}"' -f (New-SecureSecret))
        )

        if (-not $IncludeGemini) {
            $BackendTemplate = $BackendTemplate.Replace(
                '# Optional: Google Gemini API key. If unset, the AI assistant endpoints',
                "# Optional: add a Google Gemini API key locally when AI development is required.`r`n# Never commit the key. If unset, the AI assistant endpoints"
            )
        }

        Set-Content -LiteralPath $BackendEnvironment -Value $BackendTemplate -Encoding utf8NoBOM
        Write-Host "Created backend/.env with a random local JWT secret."
    }
    else {
        $ExistingBackendEnvironment = Get-Content -Raw -LiteralPath $BackendEnvironment
        if ($ExistingBackendEnvironment -match 'JWT_SECRET="?change-this-to-a-long-random-string"?') {
            $ExistingBackendEnvironment = $ExistingBackendEnvironment.Replace(
                'JWT_SECRET="change-this-to-a-long-random-string"',
                ('JWT_SECRET="{0}"' -f (New-SecureSecret))
            )
            Set-Content -LiteralPath $BackendEnvironment -Value $ExistingBackendEnvironment -Encoding utf8NoBOM
            Write-Host "Replaced the example backend JWT secret with a random local secret."
        }
        else {
            Write-Host "backend/.env already exists; leaving it unchanged."
        }
    }
}

function Install-Dependencies {
    if ($SkipInstall) {
        Write-Host "Dependency installation skipped."
        return
    }

    Write-Step "Installing locked frontend dependencies"
    Invoke-Npm -WorkingDirectory $RepositoryRoot -Arguments @("ci")

    Write-Step "Installing locked backend dependencies"
    Invoke-Npm -WorkingDirectory $BackendRoot -Arguments @("ci")
}

function Test-EnvironmentSafety {
    Write-Step "Checking development configuration"

    if (-not (Test-Path -LiteralPath $BackendEnvironment)) {
        throw "backend/.env is missing. Run this script with -Task Setup first."
    }

    $BackendSettings = Get-Content -Raw -LiteralPath $BackendEnvironment
    if ($BackendSettings -match 'JWT_SECRET="?change-this-to-a-long-random-string"?') {
        throw "backend/.env still contains the example JWT secret."
    }

    if ($BackendSettings -notmatch '(?m)^FRONTEND_ORIGIN="?(http://localhost:5173)"?\s*$') {
        Write-Warning "FRONTEND_ORIGIN is not the expected local development origin."
    }

    $GeminiLine = ($BackendSettings -split "`r?`n" |
        Where-Object { $_ -match '^\s*GEMINI_API_KEY\s*=' } |
        Select-Object -First 1)
    $GeminiValue = if ($null -ne $GeminiLine) {
        (($GeminiLine -split "=", 2)[1]).Trim().Trim('"').Trim("'")
    }
    else {
        ""
    }

    if (-not [string]::IsNullOrWhiteSpace($GeminiValue)) {
        Write-Host "Gemini is configured locally. Confirm backend/.env remains ignored by Git."
    }
    else {
        Write-Host "Gemini is not configured; non-AI development can continue normally."
    }

    Push-Location $RepositoryRoot
    try {
        $IgnoredEnvironment = & git check-ignore "backend/.env"
        if ($LASTEXITCODE -ne 0) {
            throw "backend/.env is not ignored by Git. Do not continue with secrets in this state."
        }
        Write-Host "Local backend environment is ignored by Git: $IgnoredEnvironment"
    }
    finally {
        Pop-Location
    }
}

function Invoke-Tests {
    Write-Step "Running frontend type checking"
    Invoke-Npm -WorkingDirectory $RepositoryRoot -Arguments @("run", "typecheck")

    Write-Step "Running frontend tests"
    Invoke-Npm -WorkingDirectory $RepositoryRoot -Arguments @("test", "--", "--reporter=default")

    Write-Step "Running backend tests in one worker with compiled output excluded"
    Invoke-Npm -WorkingDirectory $BackendRoot -Arguments @(
        "test", "--", "--exclude", "dist/**", "--maxWorkers=1", "--reporter=default"
    )
}

function Invoke-Builds {
    Write-Step "Building the frontend"
    Invoke-Npm -WorkingDirectory $RepositoryRoot -Arguments @("run", "build")

    Write-Step "Building the backend"
    Invoke-Npm -WorkingDirectory $BackendRoot -Arguments @("run", "build")
}

function Invoke-Audits {
    Write-Step "Auditing production frontend dependencies"
    $FrontendAudit = Invoke-Npm -WorkingDirectory $RepositoryRoot -Arguments @("audit", "--omit=dev") -AllowFailure
    if ($FrontendAudit -ne 0) {
        Write-Warning "Frontend dependency advisories were found. Review them; this script will not apply automatic breaking upgrades."
    }

    Write-Step "Auditing production backend dependencies"
    $BackendAudit = Invoke-Npm -WorkingDirectory $BackendRoot -Arguments @("audit", "--omit=dev") -AllowFailure
    if ($BackendAudit -ne 0) {
        Write-Warning "Backend dependency advisories were found. Review them before deployment."
    }
}

function Start-Development {
    Test-EnvironmentSafety

    Write-Step "Starting backend on http://localhost:4000"
    $BackendProcess = Start-Process `
        -FilePath "npm.cmd" `
        -ArgumentList @("run", "dev") `
        -WorkingDirectory $BackendRoot `
        -PassThru `
        -WindowStyle Hidden

    try {
        Start-Sleep -Seconds 2
        if ($BackendProcess.HasExited) {
            throw "The backend stopped during startup. Run 'npm run dev' from backend/ to inspect its output."
        }

        Write-Step "Starting frontend on http://localhost:5173"
        Write-Host "Press Ctrl+C to stop both services." -ForegroundColor Yellow
        Invoke-Npm -WorkingDirectory $RepositoryRoot -Arguments @("run", "dev")
    }
    finally {
        if ($null -ne $BackendProcess -and -not $BackendProcess.HasExited) {
            Stop-Process -Id $BackendProcess.Id
            Write-Host "Stopped the backend development process."
        }
    }
}

Assert-Command "node"
Assert-Command "npm"
Assert-Command "git"

$NodeMajor = [int]((& node --version).TrimStart("v").Split(".")[0])
if ($NodeMajor -lt 22) {
    throw "Node.js 22 or newer is required. Detected: $(& node --version)"
}

Write-Host "TechSubbies secure-foundation developer helper" -ForegroundColor Green
Write-Host "Repository: $RepositoryRoot"
Write-Host "Task: $Task"

switch ($Task) {
    "Setup" {
        Initialize-Environment
        Install-Dependencies
        Test-EnvironmentSafety
    }
    "Check" {
        Test-EnvironmentSafety
        Invoke-Tests
        Invoke-Builds
    }
    "Test" {
        Test-EnvironmentSafety
        Invoke-Tests
    }
    "Audit" {
        Invoke-Audits
    }
    "Dev" {
        Start-Development
    }
    "All" {
        Initialize-Environment
        Install-Dependencies
        Test-EnvironmentSafety
        Invoke-Tests
        Invoke-Builds
        Invoke-Audits
    }
}

Write-Host "`nCompleted task '$Task'." -ForegroundColor Green
