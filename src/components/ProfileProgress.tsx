import { Zap, TrendingUp } from 'lucide-react';
import { getRankProgress, RANKS } from '@/lib/ranks';

interface ProfileProgressProps {
  lifetimeEarned: number;
  xpPulse: boolean;
}

export function ProfileProgress({ lifetimeEarned, xpPulse }: ProfileProgressProps) {
  const { current, next, pct } = getRankProgress(lifetimeEarned);
  const currentLevel = RANKS.indexOf(current) + 1;

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 relative overflow-hidden">
      {/* Breathing neon backdrop */}
      <div className="absolute inset-0 opacity-25 pointer-events-none animate-breathe" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(167,139,250,0.15), transparent 60%)' }} />

      <div className="relative">
        {/* Badge plate header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(34,211,238,0.15))',
              border: '1px solid rgba(167,139,250,0.4)',
              boxShadow: '0 0 20px rgba(167,139,250,0.2), inset 0 0 12px rgba(34,211,238,0.1)',
            }}
          >
            <span style={{ color: '#c4b5fd' }}>{current.badge}</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-violet-400/60 font-semibold">Current Rank</p>
            <h3 className="text-base font-black text-violet-100 leading-tight">
              {current.name} <span className="text-xs text-violet-400/50 font-medium">[LVL {currentLevel}]</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {next ? `${next.minTokens - lifetimeEarned} XP to ${next.name}` : 'Maximum rank achieved'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total XP</p>
            <p className="text-lg font-black text-cyan-300">{lifetimeEarned.toLocaleString()}</p>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-cyan-400/70 font-semibold uppercase tracking-wider">XP Progress</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">{pct}%</span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(15,20,35,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {/* Track shimmer */}
            <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.1), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
            {/* Fill */}
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out relative ${xpPulse ? 'animate-countPulse' : ''}`}
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)',
                boxShadow: '0 0 12px rgba(34,211,238,0.5), 0 0 24px rgba(167,139,250,0.3)',
              }}
            >
              <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
            </div>
          </div>
          {/* Rank markers */}
          <div className="flex justify-between mt-2">
            <span className="text-[9px] text-violet-400/40 font-medium">{current.badge} {current.name}</span>
            {next ? (
              <span className="text-[9px] text-violet-400/40 font-medium">{next.badge} {next.name}</span>
            ) : (
              <span className="text-[9px] text-amber-400/40 font-medium">MAX</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
