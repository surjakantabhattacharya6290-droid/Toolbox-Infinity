import { creditTokens } from './wallet';

export interface RewardResult {
  tokens: number;
  reason: string;
}

export function rewardToolUse(toolId: string): RewardResult | null {
  const today = new Date().toDateString();
  const key = `tbx_reward_${toolId}_${today}`;
  if (localStorage.getItem(key)) return null;
  localStorage.setItem(key, '1');
  const tokens = 5;
  creditTokens(tokens, `Tool used: ${toolId}`);
  return { tokens, reason: `Daily tool reward` };
}

export function rewardFirstVisit(): RewardResult | null {
  const key = 'tbx_first_visit';
  if (localStorage.getItem(key)) return null;
  localStorage.setItem(key, '1');
  creditTokens(15, 'Welcome bonus');
  return { tokens: 15, reason: 'Welcome bonus' };
}

export function rewardPayoutMilestone(): RewardResult | null {
  const key = 'tbx_payout_milestone';
  if (localStorage.getItem(key)) return null;
  localStorage.setItem(key, '1');
  creditTokens(50, 'First payout milestone');
  return { tokens: 50, reason: 'First payout milestone' };
}
