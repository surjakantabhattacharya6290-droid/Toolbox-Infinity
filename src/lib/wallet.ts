export interface WalletLogEntry {
  amount: number;
  reason: string;
  ts: number;
}

export interface Wallet {
  balance: number;
  lifetimeEarned: number;
  log: WalletLogEntry[];
}

const STORAGE_KEY = 'tbx_wallet';

export function getWallet(): Wallet {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { balance: 0, lifetimeEarned: 0, log: [] };
    const parsed = JSON.parse(raw) as Wallet;
    return {
      balance: parsed.balance ?? 0,
      lifetimeEarned: parsed.lifetimeEarned ?? 0,
      log: Array.isArray(parsed.log) ? parsed.log.slice(-200) : [],
    };
  } catch {
    return { balance: 0, lifetimeEarned: 0, log: [] };
  }
}

export function saveWallet(wallet: Wallet): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...wallet,
    log: wallet.log.slice(-200),
  }));
}

export function creditTokens(amount: number, reason: string): Wallet {
  const wallet = getWallet();
  wallet.balance += amount;
  wallet.lifetimeEarned += amount;
  wallet.log.push({ amount, reason, ts: Date.now() });
  saveWallet(wallet);
  return wallet;
}

export function spendTokens(amount: number, reason: string): Wallet | null {
  const wallet = getWallet();
  if (wallet.balance < amount) return null;
  wallet.balance -= amount;
  wallet.log.push({ amount: -amount, reason, ts: Date.now() });
  saveWallet(wallet);
  return wallet;
}

export const PAYOUT_THRESHOLD = 1000;
