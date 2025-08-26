import { Queue } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

import { ENV } from '@/env';

const queueConnection = new IORedis(ENV.REDIS_URL);
export const queue = new Queue('analysisQueue', { connection: queueConnection });

const workerConnectionOptions: RedisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
};
export const workerConnection = new IORedis(ENV.REDIS_URL, workerConnectionOptions);
