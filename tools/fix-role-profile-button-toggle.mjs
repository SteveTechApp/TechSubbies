import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(root, `_techsubbies_backup_role_toggle_${stamp}`);

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".vite",
  ".next",
  "coverage",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      if (entry.name.startsWith("_techsubbies_backup_")) continue;
      walk(full, files);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!/\.(tsx|jsx|ts|js)$/.test(entry.name)) continue;

    files.push(full);
  }

  return files;
}

function backupFile(filePath) {
  const relative = path.relative(root, filePath);
  const destination = path.join(backupRoot, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(filePath, destination);
}

function patchFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");

  const looksLikeRoleStep =
    original.includes("Choose your role profiles") ||
    (
      original.includes("AV roles") &&
      original.includes("IT roles") &&
      original.includes("Hybrid roles")
    );

  if (!looksLikeRoleStep) {
    return null;
  }

  let text = original;
  const changes = [];

  // 1. Remove default selected roles from common state patterns.
  text = text.replace(
    /useState\s*<([^>]*(?:Role|role)[^>]*)>\s*\(\s*\[[\s\S]*?\]\s*\)/g,
    (match, typeText) => {
      if (!/selected|role/i.test(match)) return match;
      changes.push("Cleared default selected roles from typed useState array");
      return `useState<${typeText}>([])`;
    }
  );

  text = text.replace(
    /useState\s*\(\s*\[\s*(['"`][\s\S]*?['"`][\s\S]*?)\]\s*\)/g,
    (match) => {
      if (!/role|engineer|installation|field/i.test(match)) return match;
      changes.push("Cleared default selected roles from useState array");
      return "useState([])";
    }
  );

  text = text.replace(
    /\b(selectedRoleIds|selectedRoles|roleProfiles|selectedRoleProfiles|selectedProfileRoles)\s*:\s*\[[\s\S]*?\]/g,
    (match, key) => {
      changes.push(`Cleared default role array property: ${key}`);
      return `${key}: []`;
    }
  );

  // 2. Convert one-way append into toggle behaviour.
  text = text.replace(
    /set([A-Za-z0-9_]*(?:Selected|Role|Roles|Profile|Profiles)[A-Za-z0-9_]*)\s*\(\s*\[\s*\.\.\.([A-Za-z0-9_.]+)\s*,\s*([^\]\n]+?)\s*\]\s*\)/g,
    (match, setterSuffix, currentArray, roleExpression) => {
      const setter = `set${setterSuffix}`;
      const value = roleExpression.trim();
      changes.push(`Converted direct append to toggle: ${setter}`);
      return `${setter}((current) => current.includes(${value}) ? current.filter((id) => id !== ${value}) : [...current, ${value}])`;
    }
  );

  text = text.replace(
    /set([A-Za-z0-9_]*(?:Selected|Role|Roles|Profile|Profiles)[A-Za-z0-9_]*)\s*\(\s*\(\s*([A-Za-z0-9_]+)\s*\)\s*=>\s*\[\s*\.\.\.\2\s*,\s*([^\]\n]+?)\s*\]\s*\)/g,
    (match, setterSuffix, currentName, roleExpression) => {
      const setter = `set${setterSuffix}`;
      const value = roleExpression.trim();
      changes.push(`Converted functional append to toggle: ${setter}`);
      return `${setter}((${currentName}) => ${currentName}.includes(${value}) ? ${currentName}.filter((id) => id !== ${value}) : [...${currentName}, ${value}])`;
    }
  );

  // 3. Convert object-form updates inside formData/state objects.
  text = text.replace(
    /\b(selectedRoleIds|selectedRoles|roleProfiles|selectedRoleProfiles|selectedProfileRoles)\s*:\s*\[\s*\.\.\.([A-Za-z0-9_.]+)\s*,\s*([^\]\n]+?)\s*\]/g,
    (match, key, currentArray, roleExpression) => {
      const value = roleExpression.trim();
      changes.push(`Converted object append to toggle: ${key}`);
      return `${key}: ${currentArray}.includes(${value}) ? ${currentArray}.filter((id) => id !== ${value}) : [...${currentArray}, ${value}]`;
    }
  );

  // 4. Convert single role replacement arrays to toggle arrays.
  text = text.replace(
    /set([A-Za-z0-9_]*(?:Selected|Role|Roles|Profile|Profiles)[A-Za-z0-9_]*)\s*\(\s*\[\s*([A-Za-z0-9_.]+)\s*\]\s*\)/g,
    (match, setterSuffix, roleExpression) => {
      const setter = `set${setterSuffix}`;
      const value = roleExpression.trim();
      changes.push(`Converted single replacement to toggle: ${setter}`);
      return `${setter}((current) => current.includes(${value}) ? current.filter((id) => id !== ${value}) : [...current, ${value}])`;
    }
  );

  if (text === original) {
    return {
      filePath,
      changed: false,
      changes,
    };
  }

  backupFile(filePath);
  fs.writeFileSync(filePath, text, "utf8");

  return {
    filePath,
    changed: true,
    changes,
  };
}

const reports = walk(root).map(patchFile).filter(Boolean);
const changed = reports.filter((report) => report.changed);

console.log("");
console.log("==> TechSubbies role button toggle patch");
console.log("");

if (reports.length === 0) {
  console.log("No target file found.");
  console.log("Could not find text: Choose your role profiles / AV roles / IT roles / Hybrid roles");
  process.exit(2);
}

for (const report of reports) {
  console.log(`Target file: ${path.relative(root, report.filePath)}`);

  if (report.changes.length === 0) {
    console.log("  No safe automatic changes made.");
  }

  for (const change of report.changes) {
    console.log(`  - ${change}`);
  }
}

if (changed.length === 0) {
  console.log("");
  console.log("No file was changed.");
  console.log("Paste or upload the target file that contains 'Choose your role profiles'.");
  process.exit(3);
}

console.log("");
console.log(`Changed files: ${changed.length}`);
console.log(`Backup folder: ${path.relative(root, backupRoot)}`);
console.log("Patch complete.");