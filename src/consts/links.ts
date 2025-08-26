enum PAGES {
  HOME = '/',
  RESULTS = '/results',
}

export const LINKS: Record<keyof typeof PAGES, string> = {
  HOME: PAGES.HOME,
  RESULTS: PAGES.RESULTS,
} as const;
