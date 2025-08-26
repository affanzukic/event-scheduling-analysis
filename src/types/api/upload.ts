import { z } from 'zod';

import { EventsArraySchema, HolidaysSchema, TrainingSchema } from '@/lib/validator';

export type UploadBody = {
  events: z.infer<typeof EventsArraySchema>;
  holidays?: z.infer<typeof HolidaysSchema>;
  training?: z.infer<typeof TrainingSchema>;
  year?: number;
  rangeFrom?: string | null;
  rangeTo?: string | null;
  scoreCfg?: Record<string, any> | null;
}
