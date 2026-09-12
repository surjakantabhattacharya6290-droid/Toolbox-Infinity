import { useMemo } from 'react';
import { Flame, Gift, Lock, Check, Star } from 'lucide-react';
import { getStreakData } from '@/lib/streak';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const REWARD_TABLE = [10, 15, 20, 30, 45, 65, 100];

interface StreakEngineProps {
  streak: number;
  onReward: () => void;
}

export function StreakEngine({ streak, onReward }: StreakEngineProps) {
  const data = useMemo(() => getStreakData(), []);
  const todayIdx = ((streak - 1) % 7);
  const cycleDay = ((streak - 1) % 7) + 1;

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 relative overflow-hidden">
      {/* Breathing glow backdrop */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(251,191,36,0.12), transparent 60%)' }} />

      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-500/20 flex items-center justify-center border border-amber-400/30">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-100">Daily Streak Engine</h3>
            <p className="text-[10px] text-amber-400/50">{streak} day streak • Best: {data.longestStreak}</p>
          </div>
        </div>
        {data.streakShields > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-400/20">
            <Star className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-300 font-semibold">{data.streakShields} shield{data.streakShields !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="relative grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const dayNum = i + 1;
          const isClaimed = i < todayIdx || (i === todayIdx && streak > 0);
          const isToday = i === todayIdx;
          const isFuture = i > todayIdx;
          const reward = REWARD_TABLE[i];
          const bonus = dayNum === 7;

          return (
            <div
              key={i}
              className={`relative rounded-2xl p-3 text-center transition-all duration-300 ${
                isToday ? 'scale-105' : ''
              }`}
              style={{
                background: isClaimed
                  ? 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))'
                  : isToday
                  ? 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(244,114,182,0.06))'
                  : 'rgba(15,20,35,0.3)',
                border: isToday
                  ? '1px solid rgba(251,191,36,0.5)'
                  : isClaimed
                  ? '1px solid rgba(251,191,36,0.25)'
                  : '1px solid rgba(255,255,255,0.04)',
                boxShadow: isToday ? '0 0 20px rgba(251,191,36,0.2), inset 0 0 12px rgba(251,191,36,0.08)' : 'none',
              }}
            >
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1">{DAY_LABELS[i]}</p>

              {isClaimed ? (
                <div className="w-8 h-8 mx-auto rounded-lg bg-amber-500/20 flex items-center justify-center mb-1">
                  {bonus ? (
                    <Gift className="w-4 h-4 text-amber-300 animate-chestGlow" />
                  ) : (
                    <Check className="w-4 h-4 text-amber-300" />
                  )}
                </div>
              ) : isToday ? (
                <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-amber-400/40 to-orange-500/30 flex items-center justify-center mb-1 animate-pulseGlow">
                  <Flame className="w-4 h-4 text-amber-200" />
                </div>
              ) : (
                <div className="w-8 h-8 mx-auto rounded-lg bg-slate-800/40 flex items-center justify-center mb-1">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}

              <p className={`text-[10px] font-bold ${isClaimed || isToday ? 'text-amber-300' : 'text-slate-600'}`}>
                +{reward}
              </p>
              {bonus && (
                <p className="text-[8px] text-pink-400/70 font-semibold mt-0.5">BONUS</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <p className="text-[10px] text-slate-500">
          Next bonus at Day 7: <span className="text-pink-400 font-semibold">Rank Boost + Shield</span>
        </p>
        <p className="text-[10px] text-amber-400/60 font-semibold">
          Cycle Day {cycleDay} of 7
        </p>
      </div>
    </div>
  );
}
