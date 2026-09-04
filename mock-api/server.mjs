/**
 * Mock back-office API for the caseload triage exercise.
 *
 * Stands in for the clinic's real records API. Behaves like it too: it wants an
 * auth header, it is slow, it paginates with an opaque cursor, and it is not
 * always in a good mood.
 *
 * Run:  npm run api
 * Docs: see STARTER.md
 *
 * You are welcome to read this file. Please don't change it — we run your
 * submission against this exact server.
 */

import http from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Minimal .env reader so this works on any Node >= 20 without dependencies. */
const loadEnv = () => {
  try {
    const text = readFileSync(join(__dirname, '../.env'), 'utf8');
    for (const line of text.split('\n')) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* no .env — defaults below are fine */
  }
};
loadEnv();

const PORT = Number(process.env.API_PORT ?? 8787);
const TOKEN = process.env.API_TOKEN ?? process.env.VITE_API_TOKEN ?? 'local-dev-token';

const clients = JSON.parse(readFileSync(join(__dirname, 'data/clients.json'), 'utf8'));
const records = JSON.parse(readFileSync(join(__dirname, 'data/records.json'), 'utf8'));

/* ------------------------------------------------------------------ *
 * Keep the fixture window fresh: shift every timestamp forward so the
 * most recent record sits ~2 days before now, preserving the exact
 * string format each field arrived in.
 * ------------------------------------------------------------------ */

const DATE_KEYS = ['sessionDate', 'submitted_at', 'occurredAt', 'startedOn'];

const styleOf = (s) => {
  if (typeof s !== 'string' || s.trim() === '') return null;
  if (/Z$/.test(s)) return 'utc';
  if (/[+-]\d{2}:\d{2}$/.test(s)) return 'offset';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'dateonly';
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(s)) return 'naive';
  return null;
};

const pad = (n) => String(n).padStart(2, '0');

const render = (d, style) => {
  switch (style) {
    case 'utc':
      return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
    case 'offset': {
      const shifted = new Date(d.getTime() + 5.5 * 3600 * 1000);
      return (
        `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
        `T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}+05:30`
      );
    }
    case 'dateonly':
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    case 'naive':
      return (
        `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
      );
    default:
      return null;
  }
};

const collectTimes = (objs) => {
  const out = [];
  for (const o of objs) {
    for (const k of DATE_KEYS) {
      if (styleOf(o?.[k])) {
        const t = new Date(o[k]).getTime();
        if (Number.isFinite(t)) out.push(t);
      }
    }
  }
  return out;
};

const maxTime = Math.max(...collectTimes([...records, ...clients]));
const SHIFT = Date.now() - 2 * 86400_000 - maxTime;

const reanchor = (o) => {
  const copy = { ...o };
  for (const k of DATE_KEYS) {
    const style = styleOf(copy[k]);
    if (!style) continue;
    const t = new Date(copy[k]).getTime();
    if (!Number.isFinite(t)) continue;
    copy[k] = render(new Date(t + SHIFT), style);
  }
  return copy;
};

/* ------------------------------------------------------------------ *
 * One historical record was imported wholesale from the client's
 * previous provider and never cleaned up.
 * ------------------------------------------------------------------ */

const IMPORT_PARAGRAPHS = [
  'Session focused on the client\'s account of the events of that spring and the period immediately following. Affect constricted throughout. Client able to remain within the window of tolerance with prompting.',
  'Client described intrusive recollections occurring several times daily, typically triggered by sirens or by the smell of petrol. Avoidance of the motorway remains complete. Sleep initiation delayed by approximately ninety minutes.',
  'Reviewed the previous week\'s monitoring diary. Nightmares recorded on five of seven nights. Client reports waking with tachycardia and taking around forty minutes to resettle. Partner corroborates.',
  'Psychoeducation revisited regarding the maintenance cycle. Client engaged well and offered her own example unprompted, which is a change from earlier sessions where she deferred to the therapist\'s framing.',
  'Discussed the client\'s relationship with her sister, who was also present at the incident and with whom contact has become strained. Client feels responsible for her sister\'s reaction and has not raised it directly with her.',
  'Homework set: continue the monitoring diary, and practise the grounding sequence once daily at a neutral time rather than only during distress. Client agreed, with the caveat that mornings are difficult.',
  'Client raised concerns about the cost of ongoing treatment and whether her insurance would continue to authorise sessions. Administrative colleague to confirm the remaining authorised session count and inform the client directly.',
  'No safety concerns identified on direct questioning this session. Client denies current thoughts of self-harm and reports her reasons for living as her children and her work. Crisis contacts confirmed as current.',
];

const monsterBody = [
  '=== IMPORTED CLINICAL HISTORY (previous provider, unstructured export) ===',
  'The following is a concatenated export of 78 progress notes covering 2023-2025. Formatting was not preserved by the export. Dates within the body text are unreliable.',
  '',
  ...Array.from({ length: 78 }, (_, i) => {
    const p = IMPORT_PARAGRAPHS[i % IMPORT_PARAGRAPHS.length];
    return `--- note ${i + 1} ---\n${p} ${IMPORT_PARAGRAPHS[(i + 3) % IMPORT_PARAGRAPHS.length]} ${IMPORT_PARAGRAPHS[(i + 5) % IMPORT_PARAGRAPHS.length]}`;
  }),
].join('\n');

const monster = {
  id: 'r_039',
  kind: 'session_note',
  clientId: 'c_022',
  clinicianId: 'u_maya',
  sessionDate: '2026-08-14T10:00:00Z',
  modality: 'in-person',
  body: monsterBody,
  tags: ['imported', 'history'],
};

const ALL_RECORDS = [...records.slice(0, 22), monster, ...records.slice(22)];

/* ------------------------------------------------------------------ *
 * Transport
 * ------------------------------------------------------------------ */

const PAGE_LIMIT_DEFAULT = 10;
const PAGE_LIMIT_MAX = 25;

const encodeCursor = (offset) => Buffer.from(`o:${offset}`).toString('base64url');
const decodeCursor = (cursor) => {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const m = /^o:(\d+)$/.exec(raw);
    return m ? Number(m[1]) : NaN;
  } catch {
    return NaN;
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const latency = () => 300 + Math.floor(Math.random() * 3700);

/**
 * The records service is mid-migration. A contiguous slice of the corpus was
 * renamed by the new writer and the rest has not caught up yet. Keyed to the
 * record's position in the corpus, so it does not depend on your page size.
 */
const MIGRATED_RANGE = [20, 30];
const applyMigrationDrift = (record, absoluteIndex) => {
  const inRange = absoluteIndex >= MIGRATED_RANGE[0] && absoluteIndex < MIGRATED_RANGE[1];
  if (!inRange || record.kind !== 'session_note') return record;
  const { sessionDate, ...rest } = record;
  return { ...rest, session_date: sessionDate };
};

/** One transient failure per server run, on the second records request. */
let recordsRequestCount = 0;
let transientFailureFired = false;

const send = (res, status, payload) => {
  const bytes = Buffer.from(JSON.stringify(payload));
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': bytes.length,
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'authorization, content-type',
    'cache-control': 'no-store',
  });
  res.end(bytes);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, OPTIONS',
    });
    return res.end();
  }

  /* Unauthenticated: a service index, so that opening the base URL in a
     browser tells you something useful instead of "unauthorized". */
  if (url.pathname === '/' || url.pathname === '/api') {
    return send(res, 200, {
      service: 'clinic back-office API (mock)',
      authentication: 'Bearer token in the Authorization header — see STARTER.md',
      endpoints: {
        'GET /api/clients': 'the clinician roster',
        'GET /api/records?cursor=&limit=': 'clinical records, cursor-paginated (limit max 25)',
        'GET /api/health': 'liveness, no auth required',
      },
      docs: 'STARTER.md in the repository root',
    });
  }

  if (url.pathname === '/api/health') return send(res, 200, { ok: true });

  const auth = req.headers.authorization ?? '';
  if (auth !== `Bearer ${TOKEN}`) {
    return send(res, 401, {
      error: 'unauthorized',
      message:
        'Missing or invalid bearer token. Send `Authorization: Bearer <token>` — ' +
        'see the mock API section of STARTER.md.',
    });
  }

  await sleep(latency());

  if (url.pathname === '/api/clients') {
    return send(res, 200, { clients: clients.map(reanchor) });
  }

  if (url.pathname === '/api/records') {
    const rawLimit = Number(url.searchParams.get('limit') ?? PAGE_LIMIT_DEFAULT);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(1, Math.trunc(rawLimit)), PAGE_LIMIT_MAX)
      : PAGE_LIMIT_DEFAULT;

    const cursorParam = url.searchParams.get('cursor');
    const offset = cursorParam ? decodeCursor(cursorParam) : 0;
    if (!Number.isFinite(offset) || offset < 0) {
      return send(res, 400, { error: 'bad_cursor', message: 'Cursor could not be decoded.' });
    }

    recordsRequestCount += 1;
    if (recordsRequestCount === 2 && !transientFailureFired) {
      transientFailureFired = true;
      return send(res, 500, {
        error: 'internal_error',
        message: 'Records service temporarily unavailable. Retry.',
      });
    }

    const slice = ALL_RECORDS.slice(offset, offset + limit);
    const nextOffset = offset + slice.length;

    return send(res, 200, {
      records: slice.map((r, i) => applyMigrationDrift(reanchor(r), offset + i)),
      nextCursor: nextOffset < ALL_RECORDS.length ? encodeCursor(nextOffset) : null,
    });
  }

  send(res, 404, { error: 'not_found', message: `No route for ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`mock API listening on http://localhost:${PORT}`);
  console.log(`  ${ALL_RECORDS.length} records, ${clients.length} clients`);
  console.log(`  send: Authorization: Bearer ${TOKEN}`);
});
