import { getWeekOfMonth } from '@/lib/dateUtils';
import { Event } from '@/types/event';
import { Distributions } from '@/types/probability';

export const buildDistributions = (events: Event[]): Distributions => {
  const { monthCounts, dayCounts, weekCounts, venueCounts } = {
    monthCounts: new Map<number, number>(),
    dayCounts: new Map<number, number>(),
    weekCounts: new Map<number, number>(),
    venueCounts: new Map<string, number>(),
  }

  for (const e of events) {
    const m = e.date.getMonth();
    monthCounts.set(m, (monthCounts.get(m) || 0) + 1);
    const d = e.date.getDay();
    dayCounts.set(d, (dayCounts.get(d) || 0) + 1);
    const w = getWeekOfMonth(e.date);
    weekCounts.set(w, (weekCounts.get(w) || 0) + 1);
    venueCounts.set(e.venue, (venueCounts.get(e.venue) || 0) + 1);
  }

  const total = Math.max(1, events.length);
  for (const k of monthCounts.keys()) monthCounts.set(k, (monthCounts.get(k) || 0) / total);
  for (const k of dayCounts.keys()) dayCounts.set(k, (dayCounts.get(k) || 0) / total);
  for (const k of weekCounts.keys()) weekCounts.set(k, (weekCounts.get(k) || 0) / total);

  let sumV = 0;
  for (const v of venueCounts.values()) sumV += v;
  for (const k of venueCounts.keys()) venueCounts.set(k, (venueCounts.get(k) || 0) / Math.max(1, sumV));

  return { monthCounts, dayCounts, weekCounts, venueCounts };
}

export const dateProbability = (candidate: Date, d: Distributions) =>{
  const m = d.monthCounts.get(candidate.getMonth()) || 0;
  const w = d.weekCounts.get(getWeekOfMonth(candidate)) || 0;
  const day = d.dayCounts.get(candidate.getDay()) || 0;
  return m * 0.5 + w * 0.3 + day * 0.2;
}
