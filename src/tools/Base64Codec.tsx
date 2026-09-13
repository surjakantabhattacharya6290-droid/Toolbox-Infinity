import { useState, useMemo } from 'react';
import { Binary, Copy, Trash2, ArrowDownUp } from 'lucide-react';
import { ToolCard, ToolButton } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['base64-codec'];

type Mode = 'encode' | 'decode';

export function Base64Codec() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setError(null);
        return encoded;
      } else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setError(null);
        return decoded;
      }
    } catch (e) {
      setError(`Invalid Base64: ${(e as Error).message}`);
      return '';
    }
  }, [input, mode]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    playChime();
    pushToast('Copied to clipboard!', 'success');
  };

  const swap = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setInput(output);
    playChime();
  };

  return (
    <ToolCard tool={tool}>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('encode'); playChime(); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'encode'
            ? { background: 'linear-gradient(135deg, #4ade80, #22d3ee)', color: '#0a0f0a' }
            : { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); playChime(); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'decode'
            ? { background: 'linear-gradient(135deg, #4ade80, #22d3ee)', color: '#0a0f0a' }
            : { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
        >
          Decode
        </button>
        <button onClick={swap} className="px-3 py-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-400/20 hover:bg-green-500/20 transition-colors" title="Swap mode">
          <ArrowDownUp className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-green-400/60 mb-1.5 flex items-center gap-1.5"><Binary className="w-3.5 h-3.5" /> Input {mode === 'encode' ? '(plain text)' : '(base64)'}</p>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); if (e.target.value) rewardToolUse('base64-codec'); }}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 to decode...'}
            rows={10}
            className="w-full p-3 rounded-xl text-sm font-mono outline-none resize-y"
            style={{ background: 'rgba(10,15,10,0.6)', color: '#dcfce7', border: '1px solid rgba(74,222,128,0.2)' }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-green-400/60">Output {mode === 'encode' ? '(base64)' : '(plain text)'}</p>
            <div className="flex gap-1">
              <button onClick={copy} disabled={!output} className="p-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors disabled:opacity-40">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setInput('')} disabled={!input} className="p-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors disabled:opacity-40">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {error ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-300 font-mono">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full p-3 rounded-xl text-sm font-mono outline-none resize-y"
              style={{ background: 'rgba(15,30,15,0.6)', color: '#86efac', border: '1px solid rgba(74,222,128,0.2)' }}
            />
          )}
        </div>
      </div>
    </ToolCard>
  );
}
