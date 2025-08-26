export type Distributions = {
  monthCounts: Map<number, number>;
  dayCounts: Map<number, number>;
  weekCounts: Map<number, number>;
  venueCounts: Map<string, number>;
};

export type Training = {
  date: string;
  headliner: string;
  successScore: number;
  popularityHint?: number
}
