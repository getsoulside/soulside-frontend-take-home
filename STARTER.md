# Starter — setup and API reference

React + TypeScript + Vite + Tailwind, plus a mock API. No application code — that part is yours.

Read [`ASSIGNMENT.md`](./ASSIGNMENT.md) first. This file only covers setup and the API.

## Setup

```bash
npm install
cp .env.example .env     # then add your LLM provider key
npm run api              # terminal 1 — mock API on :8787
npm run dev              # terminal 2 — app on :5173
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm run build`.

Node 20 or newer.

## The mock API

Base URL `http://localhost:8787`. The Vite dev server also proxies `/api` there, so
`fetch('/api/records')` works from the app without CORS considerations. Talking to
`http://localhost:8787` directly works too.

**Every request needs a bearer token:**

```
Authorization: Bearer local-dev-token
```

(It comes from `VITE_API_TOKEN` in `.env`, and it's also the server's built-in fallback, so it
works out of the box — there's nothing for you to generate. Change it there if you want to.)
Requests without it get a `401`.

### `GET /api/clients`

Maya's client roster.

```json
{ "clients": [ { "id": "c_001", "name": "Aisha Khan", "status": "active", "clinicianId": "u_maya", "startedOn": "2026-02-11", "phone": "+1-415-555-0101", "preferredContact": "sms" } ] }
```

### `GET /api/records?cursor=<cursor>&limit=<n>`

Clinical records, cursor-paginated. `limit` defaults to 10 and is capped at 25. Omit `cursor`
for the first page. Keep following `nextCursor` until it comes back `null`.

```json
{ "records": [ /* ... */ ], "nextCursor": "bzoxMA" }
```

Records come in more than one shape, distinguished by `kind`:

- `session_note` — a written note from a session
- `intake_summary` — a structured intake questionnaire
- `phone_checkin` — a short call log

Working out the exact shapes is part of the job. Look at the responses.

### `GET /` and `GET /api/health`

No auth on either. `/` returns a short service index listing these endpoints — handy for
checking the server is up. `/api/health` returns `{ "ok": true }`.

Everything under `/api/` other than these two needs the header.

## Things worth knowing

This API is a faithful stand-in for the real one, which means it has the real one's
personality:

- It is **slow**, and unpredictably so. Somewhere between a third of a second and four seconds
  per request.
- It **fails sometimes**. A `500` from this API is not a bug in your code.
- It is **mid-migration**, and not every part of the corpus was migrated at the same time.
- The data in it is real clinical data in the sense that matters: humans typed it, under time
  pressure, into a system that didn't validate much.

Please don't modify `mock-api/` — we run your submission against this exact server. Reading it
is entirely fair game, though you'll probably learn more from the responses.

## On the strict config

`tsconfig.app.json` has `strict`, `noUncheckedIndexedAccess` and friends turned on, and ESLint
treats `any` as an error. That's deliberate. If you want to relax one of them, go ahead — just
name it in your README and say why. An owned decision is fine; a silently disabled rule is the
thing we'd rather not see.
