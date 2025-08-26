import { z } from "zod";

export const EventRawSchema = z.object({
  name: z.string(),
  venue: z.string(),
  date: z.string(),
  headliner: z.string().optional(),
  weight: z.number().positive().optional(),
  popularityHint: z.number().min(0).max(1).optional()
});

export const EventsArraySchema = z.array(EventRawSchema);
export const HolidaysSchema = z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
export const TrainingSchema = z.array(
  z.object({
    headliner: z.string(),
    date: z.string(),
    successScore: z.number().min(0).max(1),
    popularityHint: z.number().min(0).max(1).optional()
  })
);
