# Event Scheduling Analysis App

## Overview
Full-stack Next.js app (App Router) with server-side analysis, ML, report PDF generation, background worker (BullMQ), React Query frontend, and PostgreSQL (Prisma).

## Requirements
- Node 18+
- PostgreSQL
- Redis
- pnpm or bun
- Optional: a GPU for TFJS if needed

## Quick setup
1. copy `.env.example` -> `.env` and set DATABASE_URL and REDIS_URL
2. install deps: `pnpm install`
3. prisma generate & migrate:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init 
   ```
4. start the worker
    ```bash
    pnpm worker
    ```
5. start the dev server
    ```bash
    pnpm dev
    ```
6. open http://localhost:3000

