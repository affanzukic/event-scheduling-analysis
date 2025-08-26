export type Event = {
  date: Date;
  venue: string;
  headliner?: string;
  weight?: number;
}

export type ScoringOutput = {
  date: string;
  venue: string;
  score: number;
  dateProb: number;
  venueProb: number;
}

export type ScoringResult = {
  meta?: {
    timestamp: string;
  }
  year: number;
  top5: ScoringOutput[];
}
