import { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { RelatedTools } from '@/components/RelatedTools';
import { ToastContainer, pushToast } from '@/components/Toast';
import { PayoutModal } from '@/components/PayoutModal';
import { RankUpOverlay } from '@/components/RankUpOverlay';
import { StreakEngine } from '@/components/StreakEngine';
import { ProfileProgress } from '@/components/ProfileProgress';
import { ToolGrid } from '@/components/ToolGrid';
import { TOOL_MAP, TOOLS, type ToolId } from '@/lib/relations';
import { getWallet, type Wallet } from '@/lib/wallet';
import { evaluateDailyLogin, getStreakData } from '@/lib/streak';
import { initAudio, playChime, playArpeggio, isAudioEnabled, setAudioEnabled } from '@/lib/audio';
import { rewardFirstVisit } from '@/lib/rewards';
import { getRank } from '@/lib/ranks';

import { MultiImagePdf } from '@/tools/MultiImagePdf';
import { ImageCompressor } from '@/tools/ImageCompressor';
import { WordCounter } from '@/tools/WordCounter';
import { AgeCalculator } from '@/tools/AgeCalculator';
import { JsonFormatter } from '@/tools/JsonFormatter';
import { PasswordGenerator } from '@/tools/PasswordGenerator';
import { MetaTagGenerator } from '@/tools/MetaTagGenerator';
import { GstEmiCalculator } from '@/tools/GstEmiCalculator';
import { CssNeonGenerator } from '@/tools/CssNeonGenerator';
import { UrlShortenerQr } from '@/tools/UrlShortenerQr';

function renderTool(toolId: ToolId) {
  switch (toolId) {
    case 'multi-image-pdf': return <MultiImagePdf />;
    case 'image-compressor': return <ImageCompressor />;
    case 'word-counter': return <WordCounter />;
    case 'age-calculator': return <AgeCalculator />;
    case 'json-formatter': return <JsonFormatter />;
    case 'password-generator': return <PasswordGenerator />;
    case 'meta-tag-generator': return <MetaTagGenerator />;
    case 'gst-emi-calculator': return <GstEmiCalculator />;
    case 'css-neon-generator': return <CssNeonGenerator />;
    case 'url-shortener-qr': return <UrlShortenerQr />;
    default: return null;
  }
}

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, lifetimeEarned: 0, log: [] });
  const [streak, setStreak] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [xpPulse, setXpPulse] = useState(false);
  const [rankUp, setRankUp] = useState<{ show: boolean; name: string }>({ show: false, name: '' });
  const prevRankRef = useRef<string>('');
  const prevBalanceRef = useRef(0);
  const prevLifetimeRef = useRef(0);

  useEffect(() => {
    initAudio();
    setAudioOn(isAudioEnabled());
    const w = getWallet();
    setWallet(w);
    prevBalanceRef.current = w.balance;
    prevRankRef.current = getRank(w.lifetimeEarned).name;

    const sData = getStreakData();
    setStreak(sData.currentStreak);

    const result = evaluateDailyLogin();
    if (!result.alreadyClaimed) {
      const w2 = getWallet();
      setWallet(w2);
      setStreak(getStreakData().currentStreak);
      setXpPulse(true);
      setTimeout(() => setXpPulse(false), 600);
      setTimeout(() => {
        playArpeggio();
        pushToast(`Day ${result.streak} streak! +${result.tokens} tokens${result.bonus ? ` • ${result.bonus}` : ''}`, 'success');
      }, 500);
    }

    const firstVisit = rewardFirstVisit();
    if (firstVisit) {
      const w3 = getWallet();
      setWallet(w3);
      setXpPulse(true);
      setTimeout(() => setXpPulse(false), 600);
      setTimeout(() => pushToast(`Welcome bonus! +${firstVisit.tokens} tokens`, 'success'), 800);
    }

    const interval = setInterval(() => {
      const w = getWallet();
      const balanceChanged = w.balance !== prevBalanceRef.current;
      const lifetimeChanged = w.lifetimeEarned !== prevLifetimeRef.current;
      if (balanceChanged || lifetimeChanged) {
        prevBalanceRef.current = w.balance;
        prevLifetimeRef.current = w.lifetimeEarned;
        if (balanceChanged) {
          setXpPulse(true);
          setTimeout(() => setXpPulse(false), 600);
        }
        setWallet(w);
        const newRank = getRank(w.lifetimeEarned);
        if (newRank.name !== prevRankRef.current) {
          prevRankRef.current = newRank.name;
          setRankUp({ show: true, name: newRank.name });
          playArpeggio();
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectTool = useCallback((id: ToolId) => {
    setActiveTool(id);
    playChime(600, 900);
  }, []);

  const handleGoHome = useCallback(() => {
    setActiveTool(null);
    playChime(500, 700);
  }, []);

  const handleToggleAudio = useCallback(() => {
    const next = !audioOn;
    setAudioOn(next);
    setAudioEnabled(next);
    if (next) playChime();
  }, [audioOn]);

  const handlePayout = useCallback(() => {
    playArpeggio();
  }, []);

  const isHome = activeTool === null;

  return (
    <div className="min-h-screen flex" style={{ background: '#05070f' }}>
      {/* Immersive Deep Tech Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden cyber-grid">
        {/* Breathing radial neon meshes */}
        <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full opacity-20 animate-breathe" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent 65%)' }} />
        <div className="absolute top-1/4 -right-1/4 w-[55%] h-[55%] rounded-full opacity-15 animate-[float_25s_ease-in-out_infinite_reverse]" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 65%)' }} />
        <div className="absolute -bottom-1/4 left-1/4 w-[50%] h-[50%] rounded-full opacity-12 animate-[float_30s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.3), transparent 65%)' }} />
        {/* Scan line */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'linear-gradient(180deg, transparent, rgba(34,211,238,0.5), transparent)', height: '2px', animation: 'scanLine 8s linear infinite' }} />
      </div>

      <Sidebar
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
        isHome={isHome}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header
          balance={wallet.balance}
          lifetimeEarned={wallet.lifetimeEarned}
          streak={streak}
          audioEnabled={audioOn}
          onToggleAudio={handleToggleAudio}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPayout={() => setPayoutOpen(true)}
          onGoHome={handleGoHome}
          isHome={isHome}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-6xl mx-auto">
            {isHome ? (
              <div className="animate-[toolEnter_0.5s_ease-out] space-y-6">
                {/* Hero section */}
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-semibold">All Systems Online</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 shimmer-text">
                    Your Infinity Workspace
                  </h1>
                  <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                    Ten premium tools. One cosmic dashboard. Earn tokens, climb ranks, unlock payouts.
                  </p>
                </div>

                {/* Streak + Profile row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <StreakEngine streak={streak} onReward={() => { setXpPulse(true); setTimeout(() => setXpPulse(false), 600); }} />
                  <ProfileProgress lifetimeEarned={wallet.lifetimeEarned} xpPulse={xpPulse} />
                </div>

                {/* Tools grid */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">All Tools</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[10px] text-slate-500 font-semibold">{TOOLS.length} UTILITIES</span>
                  </div>
                  <ToolGrid onSelectTool={handleSelectTool} />
                </div>
              </div>
            ) : (
              <div className="animate-[toolEnter_0.5s_ease-out]">
                {activeTool && renderTool(activeTool)}
                {activeTool && <RelatedTools activeTool={activeTool} onSelectTool={handleSelectTool} />}
              </div>
            )}
          </div>
        </main>
      </div>

      <ToastContainer />
      <PayoutModal open={payoutOpen} balance={wallet.balance} onClose={() => setPayoutOpen(false)} onPayout={handlePayout} />
      <RankUpOverlay show={rankUp.show} rankName={rankUp.name} onClose={() => setRankUp({ show: false, name: '' })} />
    </div>
  );
}
