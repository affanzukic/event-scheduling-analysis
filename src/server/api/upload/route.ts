import { NextResponse } from 'next/server';

import { hashString } from '@/lib/hash';
import { prisma } from '@/lib/prisma';
import { EventsArraySchema, HolidaysSchema } from '@/lib/validator';
import { UploadBody } from '@/types/api/upload';

export async function POST(req: Request) {
    const body = await req.json() as UploadBody;
    const events = EventsArraySchema.parse(body.events);
    const holidays = body.holidays ? HolidaysSchema.parse(body.holidays) : [];

    // Upsert events to DB (simple create for now)
    for (const e of events) {
        await prisma.event.create({
            data: { name: e.name, venue: e.venue, date: new Date(e.date), headliner: e.headliner ?? null, weight: e.weight ?? 1, popularityHint: e.popularityHint ?? null }
        });
    }

    const inputHash = hashString(JSON.stringify({ events, holidays }));
    return NextResponse.json({ ok: true, inputHash, eventsCount: events.length, holidaysCount: holidays.length });
}
