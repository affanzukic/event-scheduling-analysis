import { NextResponse } from 'next/server';

import { hashString } from '@/lib/hash';
import { prisma } from '@/lib/prisma';
import { queue } from '@/lib/queue';
import { EventsArraySchema, HolidaysSchema, TrainingSchema } from '@/lib/validator';
import { UploadBody } from '@/types/api/upload';

export async function POST(req: Request) {
  const body = await req.json() as UploadBody;
  const events = EventsArraySchema.parse(body.events || []);
  const holidays = body.holidays ? HolidaysSchema.parse(body.holidays) : [];
  const training = body.training ? TrainingSchema.parse(body.training) : [];
  const year = body.year || new Date().getFullYear();
  const rangeFrom = body.rangeFrom ?? null;
  const rangeTo = body.rangeTo ?? null;
  const scoreCfg = body.scoreCfg ?? null;

  const inputHash = hashString(JSON.stringify({ events, holidays }));

  // Check cache
  const existing = await prisma.analysis.findUnique({ where: { inputHash } });
  if (existing) return NextResponse.json({ cached: true, id: existing.id, result: existing.resultJson });

  // Enqueue
  const job = await queue.add("runAnalysis", { events, holidays, training, year, rangeFrom, rangeTo, scoreCfg, inputHash }, { attempts: 3, backoff: { type: "exponential", delay: 1000 } });

  return NextResponse.json({ enqueued: true, jobId: job.id });
}
