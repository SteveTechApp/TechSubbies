import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(root, `_techsubbies_backup_role_toggle_files_${stamp}`);

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vite",
  ".next",
]);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function walk(dirPath, results = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }

      if (entry.name.startsWith("_techsubbies_backup_")) {
        continue;
      }

      walk(fullPath, results);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
      continue;
    }

    results.push(fullPath);
  }

  return results;
}

function backupFile(filePath) {
  const relativePath = path.relative(root, filePath);
  const backupPath = path.join(backupRoot, relativePath);
  ensureDir(path.dirname(backupPath));
  fs.copyFileSync(filePath, backupPath);
}

function getSetterStateInfo(source) {
  const map = new Map();

  const stateRegex =
    /const\s*\[\s*([A-Za-z_$][\w$]*)\s*,\s*(set[A-Za-z_$][\w$]*)\s*\]\s*=\s*useState\s*(?:<([^>]*)>)?\s*\(([^;\n]*)\)/g;

  let match;

  while ((match = stateRegex.exec(source))) {
    const stateName = match[1];
    const setterName = match[2];
    const typeText = (match[3] || "").trim();
    const initialValue = (match[4] || "").trim();

    const isArray =
      initialValue.startsWith("[") ||
      /\[\]/.test(typeText) ||
      /Array\s*</.test(typeText) ||
      /RoleIds|Roles|roleIds|roles/.test(stateName);

    let emptyValue = "null";

    if (initialValue === '""') {
      emptyValue = '""';
    }

    if (initialValue === "''") {
      emptyValue = "''";
    }

    if (initialValue === "null") {
      emptyValue = "null";
    }

    map.set(setterName, {
      stateName,
      setterName,
      typeText,
      initialValue,
      isArray,
      emptyValue,
    });
  }

  return map;
}

function buildToggleCall(info, valueExpression) {
  const value = valueExpression.trim();

  if (info.isArray) {
    return `${info.setterName}((current) => current.includes(${value}) ? current.filter((id) => id !== ${value}) : [...current, ${value}])`;
  }

  return `${info.setterName}((current) => current === ${value} ? ${info.emptyValue} : ${value})`;
}

function patchDirectRoleButtonClicks(source, setterMap, changes) {
  return source.replace(
    /onClick=\{\(\)\s*=>\s*(set[A-Za-z_$][\w$]*)\(([^{};\n]+?)\)\s*\}/g,
    (fullMatch, setterName, valueExpression) => {
      const info = setterMap.get(setterName);

      if (!info) {
        return fullMatch;
      }

      if (!/role|Role|job|Job|profile|Profile/.test(setterName + " " + valueExpression)) {
        return fullMatch;
      }

      if (/=>/.test(valueExpression)) {
        return fullMatch;
      }

      const replacement = `onClick={() => ${buildToggleCall(info, valueExpression)}}`;
      changes.push(`Direct role button click patched for ${setterName}`);
      return replacement;
    }
  );
}

function patchSingleLineRoleHandlers(source, setterMap, changes) {
  return source.replace(
    /const\s+([A-Za-z_$][\w$]*(?:Role|role)[A-Za-z_$\w]*)\s*=\s*\(\s*([A-Za-z_$][\w$]*)\s*(?::\s*[^)]*)?\s*\)\s*=>\s*(set[A-Za-z_$][\w$]*)\(\s*\2\s*\)\s*;/g,
    (fullMatch, handlerName, parameterName, setterName) => {
      const info = setterMap.get(setterName);

      if (!info) {
        return fullMatch;
      }

      const replacement = `const ${handlerName} = (${parameterName}: string) => {
  ${buildToggleCall(info, parameterName)};
};`;

      changes.push(`Single-line role handler patched: ${handlerName}`);
      return replacement;
    }
  );
}

function patchBlockRoleHandlers(source, setterMap, changes) {
  return source.replace(
    /const\s+([A-Za-z_$][\w$]*(?:Role|role)[A-Za-z_$\w]*)\s*=\s*\(\s*([A-Za-z_$][\w$]*)\s*(?::\s*[^)]*)?\s*\)\s*=>\s*\{\s*(set[A-Za-z_$][\w$]*)\(\s*\2\s*\)\s*;?\s*\}\s*;/g,
    (fullMatch, handlerName, parameterName, setterName) => {
      const info = setterMap.get(setterName);

      if (!info) {
        return fullMatch;
      }

      const replacement = `const ${handlerName} = (${parameterName}: string) => {
  ${buildToggleCall(info, parameterName)};
};`;

      changes.push(`Block role handler patched: ${handlerName}`);
      return replacement;
    }
  );
}

function patchAriaPressedForSingleSelectedRole(source, changes) {
  const patched = source.replace(
    /aria-pressed=\{selectedRoleId\s*===\s*([^}]+)\}/g,
    "aria-pressed={selectedRoleId === $1}"
  );

  if (patched !== source) {
    changes.push("Confirmed aria-pressed remains tied to selectedRoleId");
  }

  return patched;
}

function patchClassIncludesForSelectedRoleIds(source, changes) {
  let output = source;

  output = output.replace(
    /selectedRoleIds\.includes\(([^)]+)\)/g,
    (fullMatch) => fullMatch
  );

  if (output !== source) {
    changes.push("Confirmed selectedRoleIds includes logic");
  }

  return output;
}

function patchFile(filePath) {
  const original = readText(filePath);

  if (!/role|Role|selectedRole|SelectedRole|setSelectedRole/.test(original)) {
    return null;
  }

  const setterMap = getSetterStateInfo(original);

  if (setterMap.size === 0) {
    return null;
  }

  let updated = original;
  const changes = [];

  updated = patchDirectRoleButtonClicks(updated, setterMap, changes);
  updated = patchSingleLineRoleHandlers(updated, setterMap, changes);
  updated = patchBlockRoleHandlers(updated, setterMap, changes);
  updated = patchAriaPressedForSingleSelectedRole(updated, changes);
  updated = patchClassIncludesForSelectedRoleIds(updated, changes);

  if (updated === original) {
    return {
      filePath,
      changed: false,
      changes: [],
    };
  }

  backupFile(filePath);
  writeText(filePath, updated);

  return {
    filePath,
    changed: true,
    changes,
  };
}

const files = walk(root);
const reports = [];

for (const filePath of files) {
  const report = patchFile(filePath);

  if (!report) {
    continue;
  }

  reports.push(report);
}

const changedReports = reports.filter((report) => report.changed);
const unchangedReports = reports.filter((report) => !report.changed);

console.log("");
console.log("==> TechSubbies role toggle patch report");
console.log("");

if (changedReports.length === 0) {
  console.log("No safe automatic role-button patch was applied.");
  console.log("");
  console.log("The script looked for patterns such as:");
  console.log("  onClick={() => setSelectedRoleId(role.id)}");
  console.log("  const handleRoleSelect = (roleId: string) => setSelectedRoleId(roleId);");
  console.log("");
  console.log("Files containing role-selection state but no recognised direct pattern:");
  for (const report of unchangedReports) {
    console.log(`  - ${path.relative(root, report.filePath)}`);
  }
  console.log("");
  console.log("No files were changed.");
  process.exit(2);
}

console.log(`Changed files: ${changedReports.length}`);
console.log(`Backups copied to: ${path.relative(root, backupRoot)}`);
console.log("");

for (const report of changedReports) {
  console.log(`- ${path.relative(root, report.filePath)}`);

  for (const change of report.changes) {
    console.log(`  • ${change}`);
  }
}

console.log("");
console.log("Patch complete.");