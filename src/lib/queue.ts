import { Queue } from "bullmq";
import IORedis from "ioredis";

import { ENV } from '@/env';

const connection = new IORedis(ENV.REDIS_URL)
export const queue = new Queue("analysisQueue", { connection });
