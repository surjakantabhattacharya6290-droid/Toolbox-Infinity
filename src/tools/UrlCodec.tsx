import { useState, useMemo } from 'react';
import { Link, Copy, Trash2, ArrowDownUp } from 'lucide-react';
import { ToolCard, ToolButton } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['url-codec'];

type Mode = 'encode' | 'decode';

export function UrlCodec() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        setError(null);
        return encodeURIComponent(input);
      } else {
        setError(null);
        return decodeURIComponent(input);
      }
    } catch (e) {
      setError(`Invalid URL encoding: ${(e as Error).message}`);
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
            ? { background: 'linear-gradient(135deg, #93c5fd, #6ee7b7)', color: '#0a0f1a' }
            : { background: 'rgba(147,197,253,0.1)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.2)' }}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); playChime(); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'decode'
            ? { background: 'linear-gradient(135deg, #93c5fd, #6ee7b7)', color: '#0a0f1a' }
            : { background: 'rgba(147,197,253,0.1)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.2)' }}
        >
          Decode
        </button>
        <button onClick={swap} className="px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-400/20 hover:bg-blue-500/20 transition-colors" title="Swap mode">
          <ArrowDownUp className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-blue-400/60 mb-1.5 flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /> Input {mode === 'encode' ? '(raw URL/text)' : '(encoded URL)'}</p>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); if (e.target.value) rewardToolUse('url-codec'); }}
            placeholder={mode === 'encode' ? 'https://example.com/path with spaces' : 'https%3A%2F%2Fexample.com%2Fpath%20with%20spaces'}
            rows={10}
            className="w-full p-3 rounded-xl text-sm font-mono outline-none resize-y"
            style={{ background: 'rgba(10,15,26,0.5)', color: '#f0f9ff', border: '1px solid rgba(147,197,253,0.2)' }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-blue-400/60">Output {mode === 'encode' ? '(encoded)' : '(decoded)'}</p>
            <div className="flex gap-1">
              <button onClick={copy} disabled={!output} className="p-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors disabled:opacity-40">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setInput('')} disabled={!input} className="p-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors disabled:opacity-40">
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
              style={{ background: 'rgba(20,30,50,0.4)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.2)' }}
            />
          )}
        </div>
      </div>
    </ToolCard>
  );
}
