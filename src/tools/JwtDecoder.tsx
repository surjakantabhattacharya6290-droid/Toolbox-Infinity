import { useState, useMemo } from 'react';
import { LockKeyhole as Keyhole, Copy, Trash2, AlertCircle, Check } from 'lucide-react';
import { ToolCard, ToolButton } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['jwt-decoder'];

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split('.');
    if (parts.length < 2) return { error: 'Invalid JWT: expected at least 2 parts separated by "."' };
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2] || '(none)';
      return { header, payload, signature, error: null as string | null };
    } catch (e) {
      return { error: `Failed to decode: ${(e as Error).message}` };
    }
  }, [token]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    playChime();
    pushToast(`${label} copied!`, 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolCard tool={tool}>
      <div className="flex flex-wrap gap-2 mb-4">
        <ToolButton onClick={() => { if (decoded && !decoded.error) { copy(JSON.stringify(decoded.payload, null, 2), 'Payload'); } rewardToolUse('jwt-decoder'); }} disabled={!decoded || !!decoded.error} theme={tool.theme}>
          <span className="flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" /> Copy Payload</span>
        </ToolButton>
        <ToolButton onClick={() => setToken('')} disabled={!token} theme={tool.theme} variant="ghost">
          <span className="flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Clear</span>
        </ToolButton>
      </div>

      <div className="mb-4">
        <textarea
          value={token}
          onChange={e => { setToken(e.target.value); if (e.target.value) rewardToolUse('jwt-decoder'); }}
          placeholder="Paste a JWT token here (e.g. eyJhbGciOi...)"
          rows={4}
          className="w-full p-3 rounded-xl text-sm font-mono outline-none resize-y"
          style={{ background: 'rgba(10,15,10,0.6)', color: '#dcfce7', border: '1px solid rgba(74,222,128,0.2)' }}
        />
      </div>

      {decoded?.error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-400/30 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-300 font-mono">{decoded.error}</p>
        </div>
      ) : decoded ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-green-400/80 flex items-center gap-1.5"><Keyhole className="w-3.5 h-3.5" /> Header</p>
              <button onClick={() => copy(JSON.stringify(decoded.header, null, 2), 'Header')} className="p-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors">
                {copied === 'Header' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-3 rounded-xl text-xs font-mono overflow-auto" style={{ background: 'rgba(15,30,15,0.6)', color: '#86efac', border: '1px solid rgba(74,222,128,0.2)' }}>
{JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-green-400/80 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Payload</p>
              <button onClick={() => copy(JSON.stringify(decoded.payload, null, 2), 'Payload')} className="p-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors">
                {copied === 'Payload' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-3 rounded-xl text-xs font-mono overflow-auto max-h-64" style={{ background: 'rgba(15,30,15,0.6)', color: '#86efac', border: '1px solid rgba(74,222,128,0.2)' }}>
{JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-green-400/80 mb-1.5">Signature</p>
            <p className="p-3 rounded-xl text-xs font-mono break-all" style={{ background: 'rgba(15,30,15,0.4)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.15)' }}>
              {decoded.signature}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <Keyhole className="w-12 h-12 mx-auto text-green-400/30 mb-3" />
          <p className="text-sm text-green-500/40">Paste a JWT token to decode its header and payload</p>
        </div>
      )}
    </ToolCard>
  );
}
