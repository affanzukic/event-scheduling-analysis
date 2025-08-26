import 'dotenv/config';

import { Worker } from 'bullmq';

import { DEFAULTS_SCORING } from '@/consts/scoring';
import { trainHeadlinerModel } from '@/lib/analysis/headlinerModel';
import { buildDistributions } from '@/lib/analysis/probability';
import { computeScores } from '@/lib/analysis/scoring';
import { generateCandidateDates } from '@/lib/dateUtils';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { workerConnection } from '@/lib/redis';
import { UploadBody } from '@/types/api/upload';

const worker = new Worker<UploadBody>('analysisQueue', async ({ data }) => {
    try {
        await prisma.analysis.create({ data: { inputHash: data.inputHash ?? '', eventsCount: data.events?.length ?? 0, holidaysCount: data.holidays?.length ?? 0, year: data.year ?? new Date().getFullYear(), status: 'processing', resultJson: {} } });
        // convert events
        const events = (data.events || []).map((e) => ({ ...e, date: new Date(e.date) }));
        const training = data.training || [];

        const model = await trainHeadlinerModel(training);
        const dists = buildDistributions(events);
        const holidaySet = new Set((data.holidays || []) as string[]);
        const candidates = generateCandidateDates(data.year ?? new Date().getFullYear(), holidaySet, data.rangeFrom ? new Date(data.rangeFrom) : null, data.rangeTo ? new Date(data.rangeTo) : null);
        const venues = Array.from(new Set(events.map((e) => e.venue)));
        const { all, top5 } = computeScores(candidates, venues, events, dists, model, data.scoreCfg ?? DEFAULTS_SCORING);

        const result = { year: data.year, all, top5, meta: { eventsCount: events.length, holidaysCount: (data.holidays || []).length, timestamp: new Date().toISOString() } };

        await prisma.analysis.update({ where: { inputHash: data.inputHash }, data: { resultJson: result, status: 'done' } });

        return { ok: true, id: data.inputHash };
    } catch (err) {
        logger.error('Worker failed: ' + (err as Error)?.stack || err);
        // mark failed
        await prisma.analysis.updateMany({ where: { inputHash: data.inputHash }, data: { status: 'failed' } });
        throw err;
    }
}, { connection: workerConnection });

worker.on('completed', job => logger.info('Job completed: ' + job.id));
worker.on('failed', (job, err) => logger.error('Job failed: ' + job?.id + ' error: ' + String(err)));
