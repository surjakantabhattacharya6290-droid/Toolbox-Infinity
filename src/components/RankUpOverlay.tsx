import { useEffect } from 'react';
import { getTheme } from '@/lib/theme';

interface RankUpOverlayProps {
  show: boolean;
  rankName: string;
  onClose: () => void;
}

export function RankUpOverlay({ show, rankName, onClose }: RankUpOverlayProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const theme = getTheme('cyberpunk');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 animate-[fadeIn_0.3s_ease-out]"
        style={{ background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 70%)` }}
      />
      <div className="relative animate-[rankUpPop_0.5s_ease-out]">
        <div
          className="px-12 py-8 rounded-3xl backdrop-blur-2xl text-center relative overflow-hidden"
          style={{
            background: 'rgba(10,14,26,0.7)',
            border: `2px solid ${theme.primary}`,
            boxShadow: `0 0 60px ${theme.glow}, 0 0 120px ${theme.glow2}, inset 0 0 40px ${theme.glow2}`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }} />
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.textMuted }}>Rank Up</p>
          <h2 className="text-4xl font-black shimmer-text mb-2">{rankName}</h2>
          <div className="flex justify-center gap-1.5 mt-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.primary, animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
