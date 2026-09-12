import { useState, useEffect, useCallback } from 'react';
import { KeyRound, Copy, RefreshCw, Check } from 'lucide-react';
import { ToolCard, ToolButton, ToolLabel } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['password-generator'];

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = '';
    (Object.keys(SETS) as (keyof typeof SETS)[]).forEach(k => { if (opts[k]) chars += SETS[k]; });
    if (!chars) { setPassword(''); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let pw = '';
    for (let i = 0; i < length; i++) pw += chars[arr[i] % chars.length];
    setPassword(pw);
    playChime(800, 1200);

    // Strength calculation
    let s = 0;
    if (length >= 8) s += 1;
    if (length >= 12) s += 1;
    if (length >= 16) s += 1;
    const usedSets = Object.values(opts).filter(Boolean).length;
    s += usedSets;
    if (length >= 20 && usedSets >= 3) s += 1;
    setStrength(Math.min(5, s));
    rewardToolUse('password-generator');
  }, [length, opts]);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    playChime();
    pushToast('Password copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981'];

  return (
    <ToolCard tool={tool}>
      <div className="p-4 rounded-2xl mb-5 flex items-center gap-3" style={{ background: 'rgba(30,28,14,0.6)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <code className="flex-1 text-lg font-mono text-amber-200 break-all">{password || 'Select at least one set'}</code>
        <button onClick={copy} disabled={!password} className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors disabled:opacity-40">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        <button onClick={generate} className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <ToolLabel theme={tool.theme}>Password Length</ToolLabel>
          <span className="text-sm font-bold text-amber-300">{length}</span>
        </div>
        <input type="range" min="4" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-amber-400" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {(Object.keys(SETS) as (keyof typeof SETS)[]).map(k => (
          <button
            key={k}
            onClick={() => setOpts(prev => ({ ...prev, [k]: !prev[k] }))}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
            style={{
              background: opts[k] ? 'rgba(251,191,36,0.15)' : 'rgba(30,28,14,0.4)',
              border: `1px solid ${opts[k] ? 'rgba(251,191,36,0.4)' : 'rgba(251,191,36,0.1)'}`,
            }}
          >
            <span className="text-sm capitalize text-amber-200">{k}</span>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${opts[k] ? 'bg-amber-400' : 'bg-slate-700'}`}>
              {opts[k] && <Check className="w-3 h-3 text-slate-900" />}
            </div>
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <ToolLabel theme={tool.theme}>Strength</ToolLabel>
          <span className="text-xs font-semibold" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-all duration-300"
              style={{ background: i < strength ? strengthColors[strength] : 'rgba(251,191,36,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <ToolButton onClick={generate} theme={tool.theme} className="w-full">
          <span className="flex items-center justify-center gap-2"><KeyRound className="w-4 h-4" /> Generate New Password</span>
        </ToolButton>
      </div>
    </ToolCard>
  );
}
