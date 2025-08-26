import { DEFAULTS_SCORING, ScoringConfig } from '@/consts/scoring';
import { scoreHeadliner } from '@/lib/analysis/headlinerModel';
import { dateProbability } from '@/lib/analysis/probability';
import { Event, ScoringOutput } from '@/types/event';
import { Distributions } from '@/types/probability';
import { HeadlinerModel } from '@/types/training';

export const scoreDateVenue = (dateISO: string, venue: string, events: Event[], dists: Distributions, headModel: HeadlinerModel, cfg = DEFAULTS_SCORING) =>{
    const cDate = new Date(dateISO);
    if (events.some(e => e.venue === venue && e.date.toISOString().split('T')[0] === dateISO)) return 0;
    let score = 100;
    for (const e of events) {
        const diff = Math.abs((e.date.getTime() - cDate.getTime()) / 86400000);
        if (diff <= cfg.nearbyWindowDays) {
            const h = scoreHeadliner(e.date, headModel, e.headliner);
            const w = e.weight ?? 1;
            const penalty = cfg.baseNearbyPenalty * (0.5 + h) * w;
            score -= penalty;
        }
    }
    const p = dateProbability(cDate, dists);
    score -= p * cfg.probWeight;
    const vprob = dists.venueCounts.get(venue) || 0;
    score -= vprob * cfg.venueWeight;
    let maxH = 0;
    for (const e of events) {
        if (e.venue !== venue) continue;
        const diff = Math.abs((e.date.getTime() - cDate.getTime()) / 86400000);
        if (diff <= cfg.nearbyWindowDays * 2) {
            const s = scoreHeadliner(e.date, headModel, e.headliner);
            if (s > maxH) maxH = s;
        }
    }
    score -= maxH * cfg.headlinerWeight;
    return Math.max(0, score);
};

export const computeScores = (candidates: string[], venues: string[], events: Event[], dists: Distributions, headModel: HeadlinerModel, cfg?: ScoringConfig) => {
    const out: ScoringOutput[] = [];
    const usedCfg = { ...DEFAULTS_SCORING, ...(cfg || {}) };
    for (const date of candidates) {
        const dp = dateProbability(new Date(date), dists);
        for (const v of venues) {
            const vp = dists.venueCounts.get(v) || 0;
            const sc = scoreDateVenue(date, v, events, dists, headModel, usedCfg);
            out.push({ date, venue: v, score: sc, dateProb: dp, venueProb: vp });
        }
    }
    out.sort((a, b) => b.score - a.score);
    return { all: out, top5: out.slice(0, 5) };
};
