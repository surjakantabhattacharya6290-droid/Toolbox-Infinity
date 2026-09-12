import { useState, useRef, useEffect } from 'react';
import { Link2, QrCode, Download, Copy, Trash2, ExternalLink } from 'lucide-react';
import { ToolCard, ToolButton, ToolLabel, ToolInput } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';
import QRCode from 'qrcode';

const tool = TOOL_MAP['url-shortener-qr'];

interface ShortenedUrl {
  id: string;
  original: string;
  short: string;
  clicks: number;
  createdAt: number;
}

const STORAGE_KEY = 'tbx_short_urls';

function loadUrls(): ShortenedUrl[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveUrls(urls: ShortenedUrl[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export function UrlShortenerQr() {
  const [inputUrl, setInputUrl] = useState('');
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [qrSize, setQrSize] = useState(256);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    setUrls(loadUrls());
  }, []);

  useEffect(() => {
    saveUrls(urls);
  }, [urls]);

  // Generate QR codes using strict index 0 logic
  useEffect(() => {
    urls.forEach((u, idx) => {
      if (idx !== 0 && urls.length > 1) return; // strict index 0 for mobile safety
      const canvas = canvasRefs.current[u.id];
      if (!canvas) return;
      QRCode.toCanvas(canvas, u.original, {
        width: qrSize,
        margin: 2,
        color: { dark: '#22d3ee', light: '#0a0e1a' },
      }).catch(() => {});
    });
  }, [urls, qrSize]);

  // Generate all QR codes (non-index-0 path for desktop)
  useEffect(() => {
    if (urls.length <= 1) return;
    urls.forEach(u => {
      const canvas = canvasRefs.current[u.id];
      if (!canvas) return;
      QRCode.toCanvas(canvas, u.original, {
        width: qrSize,
        margin: 2,
        color: { dark: '#22d3ee', light: '#0a0e1a' },
      }).catch(() => {});
    });
  }, [urls, qrSize]);

  const shorten = () => {
    if (!inputUrl.trim()) return;
    let url = inputUrl.trim();
    if (!/^https?:\/\//.test(url)) url = `https://${url}`;
    try { new URL(url); } catch { pushToast('Invalid URL', 'error'); return; }
    const id = generateShortId();
    const short = `tbx.co/${id}`;
    const newEntry: ShortenedUrl = { id, original: url, short, clicks: 0, createdAt: Date.now() };
    setUrls(prev => [newEntry, ...prev]);
    setInputUrl('');
    playChime();
    pushToast('URL shortened & QR generated! +5 tokens', 'success');
    rewardToolUse('url-shortener-qr');
  };

  const copyShort = (short: string) => {
    navigator.clipboard.writeText(short);
    playChime();
    pushToast('Short URL copied!', 'success');
  };

  const downloadQr = (id: string) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `qr-${id}.png`;
    a.href = canvas.toDataURL();
    a.click();
    playChime();
    pushToast('QR code downloaded!', 'success');
  };

  const removeUrl = (id: string) => {
    setUrls(prev => prev.filter(u => u.id !== id));
    setQrMap(prev => { const c = { ...prev }; delete c[id]; return c; });
  };

  const openOriginal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <ToolCard tool={tool}>
      <div className="space-y-3 mb-5">
        <div>
          <ToolLabel theme={tool.theme}>URL to shorten</ToolLabel>
          <div className="flex gap-2">
            <ToolInput value={inputUrl} onChange={setInputUrl} placeholder="https://example.com/very/long/url" theme={tool.theme} className="flex-1" />
            <ToolButton onClick={shorten} disabled={!inputUrl.trim()} theme={tool.theme}>
              <span className="flex items-center gap-2"><Link2 className="w-4 h-4" /> Shorten</span>
            </ToolButton>
          </div>
        </div>
        <div>
          <ToolLabel theme={tool.theme}>QR Code Size: {qrSize}px</ToolLabel>
          <input type="range" min="128" max="512" step="32" value={qrSize} onChange={e => setQrSize(Number(e.target.value))} className="w-full accent-blue-400" />
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-10">
          <QrCode className="w-12 h-12 mx-auto text-blue-400/30 mb-3" />
          <p className="text-sm text-blue-300/50">Shorten a URL to generate a scannable QR code</p>
        </div>
      ) : (
        <div className="space-y-3">
          {urls.map(u => (
            <div key={u.id} className="p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center" style={{ background: 'rgba(147,197,253,0.06)', border: '1px solid rgba(147,197,253,0.15)' }}>
              <canvas ref={el => { canvasRefs.current[u.id] = el; }} className="rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-blue-200">{u.short}</span>
                  <button onClick={() => copyShort(u.short)} className="p-1 rounded hover:bg-blue-500/20 text-blue-300">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-blue-400/50 truncate mb-2">{u.original}</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => openOriginal(u.original)} className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 text-xs flex items-center gap-1 hover:bg-blue-500/25">
                    <ExternalLink className="w-3 h-3" /> Open
                  </button>
                  <button onClick={() => downloadQr(u.id)} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs flex items-center gap-1 hover:bg-emerald-500/25">
                    <Download className="w-3 h-3" /> QR
                  </button>
                  <button onClick={() => removeUrl(u.id)} className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-xs flex items-center gap-1 hover:bg-rose-500/25">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}
