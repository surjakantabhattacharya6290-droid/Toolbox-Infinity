import { Menu, Volume2, VolumeX, Wallet as WalletIcon, TrendingUp, Lock, ChevronRight, Search, Sun, Moon, Monitor } from 'lucide-react';
import { getRankProgress } from '@/lib/ranks';
import { PAYOUT_THRESHOLD } from '@/lib/wallet';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import type { AppTheme } from '@/lib/theme';

interface HeaderProps {
  balance: number;
  lifetimeEarned: number;
  streak: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenMobileNav: () => void;
  onOpenPayout: () => void;
  onGoHome: () => void;
  isHome: boolean;
  onOpenSearch: () => void;
  appTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export function Header({ balance, lifetimeEarned, streak, audioEnabled, onToggleAudio, onOpenMobileNav, onOpenPayout, onGoHome, isHome, onOpenSearch, appTheme, onThemeChange }: HeaderProps) {
  const { current, next } = getRankProgress(lifetimeEarned);
  const canPayout = balance >= PAYOUT_THRESHOLD;

  const themeOptions: { id: AppTheme; icon: typeof Sun; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobileNav} className="p-2 rounded-lg hover:bg-white/5 text-cyan-400 md:hidden transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={onGoHome} className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 16c-2 0-3-1.5-3-3.5S4.5 9 6.5 9c2 0 3.5 1.5 5.5 3.5S15 16 17 16c2 0 3.5-1.5 3.5-3.5S19 9 17 9c-2 0-3.5 1.5-5.5 3.5S8 16 6 16z"/>
              </svg>
              <div className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ boxShadow: '0 0 16px rgba(34,211,238,0.4)' }} />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-black shimmer-text tracking-tight">TOOLBOX INFINITY</span>
              <p className="text-[9px] text-slate-500 -mt-0.5 tracking-widest uppercase">Multi-Utility Platform</p>
            </div>
          </button>
        </div>

        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-slate-400 hover:text-cyan-300 transition-all hover:scale-[1.02] min-w-[200px]"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Search tools...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">⌘K</kbd>
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl glass-card">
            {themeOptions.map(opt => {
              const Icon = opt.icon;
              const isActive = appTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onThemeChange(opt.id)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'scale-105' : 'hover:scale-105'}`}
                  style={isActive ? { background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.1))' } : {}}
                  title={`${opt.label} theme`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Cybernetic Badge Plate */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl relative overflow-hidden" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)' }}>
            <div className="absolute inset-0 opacity-20 animate-breathe" style={{ background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.3), transparent 70%)' }} />
            <span className="text-base font-black text-violet-300 relative">{current.badge}</span>
            <div className="relative">
              <span className="text-xs font-bold text-violet-200 block leading-none">{current.name}</span>
              <span className="text-[8px] text-violet-400/50 block leading-none mt-0.5">LVL {lifetimeEarned >= 5000 ? 'MAX' : Math.floor(lifetimeEarned / 50) + 1}</span>
            </div>
            {next && <ChevronRight className="w-3 h-3 text-violet-500/40 relative" />}
          </div>

          {/* Audio toggle */}
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-lg glass-card text-cyan-400 transition-all hover:scale-105"
            title={audioEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Wallet balance with animated counter */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(167,139,250,0.08))',
              border: '1px solid rgba(34,211,238,0.25)',
              boxShadow: '0 0 16px rgba(34,211,238,0.1)',
            }}
          >
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(34,211,238,0.3), transparent 60%)' }} />
            <WalletIcon className="w-4 h-4 text-cyan-300 relative" />
            <div className="flex flex-col relative">
              <AnimatedCounter value={balance} className="text-sm font-black text-cyan-100 leading-none" />
              <span className="text-[8px] text-cyan-500/50 leading-none mt-0.5 uppercase tracking-wider">tokens</span>
            </div>
          </div>

          {/* Payout button */}
          <button
            onClick={onOpenPayout}
            disabled={!canPayout}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 relative overflow-hidden ${
              canPayout
                ? 'text-white hover:scale-105'
                : 'text-slate-500 cursor-not-allowed'
            }`}
            style={canPayout
              ? { background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 0 20px rgba(16,185,129,0.3)', animation: 'pulseGlow 2s ease-in-out infinite' }
              : { background: 'rgba(15,20,35,0.4)', border: '1px solid rgba(255,255,255,0.04)' }
            }
            title={canPayout ? 'Transfer tokens to bank!' : `Need ${PAYOUT_THRESHOLD} tokens to unlock payout`}
          >
            {canPayout ? <TrendingUp className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{canPayout ? 'Transfer to Bank' : `${PAYOUT_THRESHOLD}`}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
