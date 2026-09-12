import { creditTokens } from './wallet';

export interface StreakData {
  lastLogin: string | null;
  currentStreak: number;
  longestStreak: number;
  streakShields: number;
}

const STORAGE_KEY = 'tbx_streak';

const REWARD_TABLE = [10, 15, 20, 30, 45, 65, 100];

export function getStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastLogin: null, currentStreak: 0, longestStreak: 0, streakShields: 0 };
    const parsed = JSON.parse(raw) as StreakData;
    return {
      lastLogin: parsed.lastLogin ?? null,
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      streakShields: parsed.streakShields ?? 0,
    };
  } catch {
    return { lastLogin: null, currentStreak: 0, longestStreak: 0, streakShields: 0 };
  }
}

export interface StreakResult {
  alreadyClaimed: boolean;
  streak: number;
  tokens: number;
  bonus: string | null;
}

export function calculateReward(streakDay: number): { tokens: number; bonus: string | null } {
  const cycle = ((streakDay - 1) % 7) + 1;
  const tokens = REWARD_TABLE[cycle - 1] ?? 10;
  let bonus: string | null = null;
  if (streakDay % 7 === 0) bonus = 'Rank Boost + Streak Shield';
  if (streakDay === 14) bonus = 'Exclusive Animated Badge Frame';
  if (streakDay === 30) bonus = 'Premium UI Theme Skin';
  return { tokens, bonus };
}

export function evaluateDailyLogin(): StreakResult {
  const data = getStreakData();
  const oneDay = 86400000;
  const today = new Date().setHours(0, 0, 0, 0);
  const last = data.lastLogin ? new Date(data.lastLogin).setHours(0, 0, 0, 0) : null;

  if (last === today) {
    return { alreadyClaimed: true, streak: data.currentStreak, tokens: 0, bonus: null };
  }

  if (last === today - oneDay) {
    data.currentStreak += 1;
  } else if (last !== null && data.streakShields > 0) {
    data.streakShields -= 1;
    data.currentStreak += 1;
  } else {
    data.currentStreak = 1;
  }

  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  data.lastLogin = new Date().toISOString();

  const reward = calculateReward(data.currentStreak);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  creditTokens(reward.tokens, `Day ${data.currentStreak} Login Streak`);

  return { alreadyClaimed: false, streak: data.currentStreak, tokens: reward.tokens, bonus: reward.bonus };
}
