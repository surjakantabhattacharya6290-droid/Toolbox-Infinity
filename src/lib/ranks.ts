export interface Rank {
  name: string;
  minTokens: number;
  badge: string;
}

export const RANKS: Rank[] = [
  { name: 'Initiate', minTokens: 0, badge: '◇' },
  { name: 'Apprentice', minTokens: 50, badge: '◈' },
  { name: 'Operator', minTokens: 200, badge: '✦' },
  { name: 'Engineer', minTokens: 500, badge: '⬡' },
  { name: 'Architect', minTokens: 1000, badge: '⬢' },
  { name: 'Visionary', minTokens: 2500, badge: '✷' },
  { name: 'Infinity', minTokens: 5000, badge: '∞' },
];

export function getRank(lifetimeTokens: number): Rank {
  let result = RANKS[0];
  for (const r of RANKS) {
    if (lifetimeTokens >= r.minTokens) result = r;
  }
  return result;
}

export function getNextRank(lifetimeTokens: number): Rank | null {
  for (const r of RANKS) {
    if (lifetimeTokens < r.minTokens) return r;
  }
  return null;
}

export function getRankProgress(lifetimeTokens: number): { current: Rank; next: Rank | null; pct: number } {
  const current = getRank(lifetimeTokens);
  const next = getNextRank(lifetimeTokens);
  if (!next) return { current, next: null, pct: 100 };
  const range = next.minTokens - current.minTokens;
  const earned = lifetimeTokens - current.minTokens;
  return { current, next, pct: Math.min(100, Math.round((earned / range) * 100)) };
}
