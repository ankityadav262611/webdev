// Migration script: add new_/old_/pp_ prefixes to existing notes, names, sim_overrides
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

// IDs that belong to old URLs
const OLD_IDS = new Set([20,23,27,31,32,33,37,40,44,45,46,52,53,56,65,66,68,69,70,72,73,84,85,86,87,88,89,100]);
// IDs that belong to PP URLs
const PP_IDS  = new Set([101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116]);

function getPrefix(id) {
  const n = parseInt(id);
  if (OLD_IDS.has(n)) return 'old';
  if (PP_IDS.has(n))  return 'pp';
  return 'new';
}

// ── Migrate device_notes.json ─────────────────────────────────────────────────
const notesFile = path.join(DATA_DIR, 'device_notes.json');
if (fs.existsSync(notesFile)) {
  const notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
  const migrated = {};
  for (const [key, val] of Object.entries(notes)) {
    // key format: "urlId:deviceId"
    const colonIdx = key.indexOf(':');
    const urlId = key.slice(0, colonIdx);
    const deviceId = key.slice(colonIdx + 1);
    // Already prefixed?
    if (urlId.startsWith('new_') || urlId.startsWith('old_') || urlId.startsWith('pp_')) {
      migrated[key] = val;
    } else {
      const prefix = getPrefix(urlId);
      migrated[`${prefix}_${urlId}:${deviceId}`] = val;
    }
  }
  fs.writeFileSync(notesFile, JSON.stringify(migrated, null, 2));
  console.log('✅ device_notes.json migrated:', Object.keys(migrated).length, 'entries');
} else {
  console.log('⚠️  device_notes.json not found');
}

// ── Migrate sim_overrides.json ────────────────────────────────────────────────
const simFile = path.join(DATA_DIR, 'sim_overrides.json');
if (fs.existsSync(simFile)) {
  const sims = JSON.parse(fs.readFileSync(simFile, 'utf8'));
  const migrated = {};
  for (const [key, val] of Object.entries(sims)) {
    if (key.startsWith('new_') || key.startsWith('old_') || key.startsWith('pp_')) {
      migrated[key] = val;
    } else {
      const prefix = getPrefix(key);
      migrated[`${prefix}_${key}`] = val;
    }
  }
  fs.writeFileSync(simFile, JSON.stringify(migrated, null, 2));
  console.log('✅ sim_overrides.json migrated:', Object.keys(migrated).length, 'entries');
} else {
  console.log('⚠️  sim_overrides.json not found');
}

// ── Migrate device_names.json ─────────────────────────────────────────────────
const namesFile = path.join(DATA_DIR, 'device_names.json');
if (fs.existsSync(namesFile)) {
  const names = JSON.parse(fs.readFileSync(namesFile, 'utf8'));
  const migrated = {};
  for (const [key, val] of Object.entries(names)) {
    const colonIdx = key.indexOf(':');
    const urlId = colonIdx >= 0 ? key.slice(0, colonIdx) : key;
    const deviceId = colonIdx >= 0 ? key.slice(colonIdx + 1) : '';
    if (urlId.startsWith('new_') || urlId.startsWith('old_') || urlId.startsWith('pp_')) {
      migrated[key] = val;
    } else {
      const prefix = getPrefix(urlId);
      migrated[`${prefix}_${urlId}:${deviceId}`] = val;
    }
  }
  fs.writeFileSync(namesFile, JSON.stringify(migrated, null, 2));
  console.log('✅ device_names.json migrated:', Object.keys(migrated).length, 'entries');
} else {
  console.log('⚠️  device_names.json not found (no names saved yet)');
}

console.log('\nMigration complete. Restart server to apply changes.');
