import { X, TrendingUp, ExternalLink, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import { PAYOUT_THRESHOLD } from '@/lib/wallet';

interface PayoutModalProps {
  open: boolean;
  balance: number;
  onClose: () => void;
  onPayout: () => void;
}

const PAYOUT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdUMMY_FORM_ID/viewform';

export function PayoutModal({ open, balance, onClose, onPayout }: PayoutModalProps) {
  const [redirecting, setRedirecting] = useState(false);

  if (!open) return null;

  const canPayout = balance >= PAYOUT_THRESHOLD;
  const shortfall = PAYOUT_THRESHOLD - balance;

  const handlePayout = () => {
    setRedirecting(true);
    onPayout();
    setTimeout(() => {
      window.open(PAYOUT_FORM_URL, '_blank', 'noopener,noreferrer');
      setRedirecting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl backdrop-blur-2xl border border-emerald-400/25 overflow-hidden animate-[modalPop_0.3s_ease-out]"
        style={{ background: 'rgba(5,15,12,0.85)', boxShadow: '0 0 40px rgba(16,185,129,0.15)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-400/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-emerald-100">Milestone Payout Gateway</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {canPayout ? (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-3 border border-emerald-400/30" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}>
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-emerald-300">{balance.toLocaleString()} tokens</p>
                <p className="text-sm text-emerald-200/50 mt-1">Available for transfer</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-400/15">
                <p className="text-xs text-emerald-200/70">
                  You've reached the milestone threshold of {PAYOUT_THRESHOLD} tokens. Click below to redirect to
                  our secure Google Form and complete your bank transfer request.
                </p>
              </div>
              <button
                onClick={handlePayout}
                disabled={redirecting}
                className="w-full py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
              >
                {redirecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Transfer to Bank
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/40 flex items-center justify-center mb-3 border border-white/5">
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-xl font-bold text-slate-300">{shortfall.toLocaleString()} tokens to go</p>
                <p className="text-sm text-slate-500 mt-1">Payout unlocks at {PAYOUT_THRESHOLD} tokens</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Progress</span>
                  <span className="text-xs font-semibold text-slate-300">{balance} / {PAYOUT_THRESHOLD}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (balance / PAYOUT_THRESHOLD) * 100)}%`, background: 'linear-gradient(90deg, #22d3ee, #10b981)', boxShadow: '0 0 8px rgba(34,211,238,0.3)' }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Use tools daily, maintain your streak, and complete tasks to earn tokens faster.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
