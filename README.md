# Event Scheduling Analysis App — README

**Professional, production-ready README** for the Event Scheduling Analysis App (Next.js App Router + server-side analysis + BullMQ worker + Prisma + TFJS + PDF report generation).
Use this file as the canonical project README for the repository, CI, and collaborators.

---

## Overview

This repository contains a full-stack event scheduling analysis system:

* **Next.js (App Router)** frontend + server routes
* **Prisma** + **PostgreSQL** for persistence
* **BullMQ** + **Redis** worker for background processing (analysis, ML training, heavy chart generation)
* **@tensorflow/tfjs-node** optional headliner model training
* **chartjs-node-canvas** server-side chart rendering
* **@react-pdf/renderer** server PDF generation (on-demand)
* **Zod** input validation, **Winston** logging
* Dev tooling: **pnpm**, **ESLint**, **Prettier**, **Husky** + **lint-staged**, **tsx** recommended for running TS scripts

---

## Features

* Validate uploaded JSON inputs with **Zod**
* Analyze event frequency by date and venue; compute optimal non-conflicting Friday/Saturday slots
* Optional headliner scoring (TFJS) and influence on date scoring
* Server-side chart generation and embedded report with **Download PDF**
* Background processing (BullMQ) to avoid blocking requests
* Caching of analysis results by input hash
* Type-safe TypeScript codebase (types centralized)

---

## Requirements

* Node 18+ (recommended 18–20)
* PostgreSQL (12+)
* Redis (6+)
* `pnpm` (recommended) or `npm` / `bun`
* Optional: GPU + TF-capable drivers if you plan heavy ML training (TFJS node works CPU only too)

---

## Quick setup (minutes)

1. Clone the repo and move into it:

```bash
git clone <repo-url> event-scheduling-analysis
cd event-scheduling-analysis
```

2. Copy env template and set credentials:

```bash
cp .env.example .env
# edit .env: DATABASE_URL, REDIS_URL, PORT (optional)
```

3. Install dependencies:

```bash
pnpm install
```

4. Generate Prisma client & run migration:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

5. Start the worker (background processor):

```bash
pnpm run worker
```

6. Start the Next dev server:

```bash
pnpm run dev
# or
pnpm dev
```

7. Open the app at `http://localhost:3000`.

---

## Important environment variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/event_scheduler
REDIS_URL=redis://127.0.0.1:6379
PORT=3000
```

---


## API examples

* Upload events via API (enqueues analysis):

```bash
curl -X POST "http://localhost:3000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{ "name":"Festival A","venue":"Dom Mladih","date":"2023-07-10","headliner":"Artist X" }],
    "holidays": ["2025-01-01"],
    "training": [{ "headliner":"Artist X","date":"2023-07-10","successScore":0.9 }],
    "year": 2025
  }'
```

* List analyses:

```
GET /api/results
```

* Get stored analysis:

```
GET /api/report/[id]
```

* Download PDF for analysis id `42`:

```
GET /api/report/pdf?id=42
```

---

### TFJS training heavy / memory

* Training on CPU may be slow and memory-heavy. If you plan heavy training, consider:

    * Pretraining offline and storing model artifacts.
    * Reducing epochs / model size.
    * Using a worker machine with more RAM or a GPU (and TF build for GPU).

## Production considerations

* Use connection pooling, limit concurrency in worker config.
* Persist large artifacts (trained model) to object storage (S3) if needed.
* Offload heavy chart/PDF generation to dedicated worker instances.
* Secure endpoints, add authentication or signed URLs for private reports.
* Use monitoring (Prometheus, Sentry) for worker health and job failures.

---

## Contributing

1. Fork and create a feature branch.
2. Follow the epoch commit plan.
3. Run lint & format before opening PR.
4. Provide a short description, and list migration changes if necessary.

---

## Contact / help

If anything breaks locally, share:

* `node` and `pnpm` versions
* `DATABASE_URL` and `REDIS_URL` (redacted)
* exact error logs from the worker and server
