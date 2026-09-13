import { useState, useEffect, useCallback } from 'react';
import { Fingerprint, Copy, Check } from 'lucide-react';
import { ToolCard } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['hash-generator'];

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algo = typeof ALGORITHMS[number];

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const computeHash = useCallback(async (text: string) => {
    if (!text) { setResults({}); return; }
    const hashes: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashes[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {
        hashes[algo] = 'Error';
      }
    }
    setResults(hashes);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => computeHash(input), 100);
    return () => clearTimeout(timeout);
  }, [input, computeHash]);

  const copy = (hash: string, algo: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    playChime();
    pushToast(`${algo} hash copied!`, 'success');
    if (input) rewardToolUse('hash-generator');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolCard tool={tool}>
      <div className="mb-5">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste text to generate cryptographic hashes..."
          rows={5}
          className="w-full p-3 rounded-xl text-sm font-mono outline-none resize-y"
          style={{ background: 'rgba(30,28,14,0.5)', color: '#fef3c7', border: '1px solid rgba(251,191,36,0.2)' }}
        />
      </div>

      {Object.keys(results).length > 0 ? (
        <div className="space-y-3">
          {ALGORITHMS.map(algo => (
            <div key={algo}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-amber-400/80 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" /> {algo}
                </p>
                <button onClick={() => copy(results[algo], algo)} className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors">
                  {copied === algo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="p-3 rounded-xl text-xs font-mono break-all" style={{ background: 'rgba(30,28,14,0.5)', color: '#fde68a', border: '1px solid rgba(251,191,36,0.15)' }}>
                {results[algo]}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Fingerprint className="w-12 h-12 mx-auto text-amber-400/30 mb-3" />
          <p className="text-sm text-amber-500/40">Enter text to generate SHA-1, SHA-256, SHA-384 & SHA-512 hashes</p>
        </div>
      )}
    </ToolCard>
  );
}
