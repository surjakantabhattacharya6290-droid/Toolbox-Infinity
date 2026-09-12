import { useState, useMemo } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { ToolCard, ToolButton, ToolLabel } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['css-neon-generator'];

export function CssNeonGenerator() {
  const [color, setColor] = useState('#22d3ee');
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [layers, setLayers] = useState(3);
  const [text, setText] = useState('NEON');
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const shadows: string[] = [];
    for (let i = 1; i <= layers; i++) {
      const b = blur * (i / layers);
      const s = spread * (i / layers);
      shadows.push(`0 0 ${b.toFixed(1)}px ${color}${i === layers ? '' : `, 0 0 ${(b * 2).toFixed(1)}px ${color}`}`);
      if (i < layers) shadows[shadows.length - 1] += `, 0 0 ${(b * 2).toFixed(1)}px ${color}`;
    }
    const shadowStr = shadows.join(', ');
    return `text-shadow: ${shadowStr};\ncolor: ${color};\nfont-weight: bold;`;
  }, [color, blur, spread, layers]);

  const boxCss = useMemo(() => {
    const shadows: string[] = [];
    for (let i = 1; i <= layers; i++) {
      const b = blur * (i / layers);
      shadows.push(`0 0 ${b.toFixed(1)}px ${color}`);
    }
    return `box-shadow: ${shadows.join(', ')};\nborder: 1px solid ${color};`;
  }, [color, blur, layers]);

  const copy = (which: string) => {
    navigator.clipboard.writeText(which === 'text' ? css : boxCss);
    setCopied(true);
    playChime();
    pushToast('CSS copied!', 'success');
    rewardToolUse('css-neon-generator');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolCard tool={tool}>
      {/* Live Preview */}
      <div className="rounded-2xl p-8 mb-5 text-center overflow-hidden" style={{ background: '#0a0f0a', border: '1px solid rgba(74,222,128,0.2)' }}>
        <p
          className="text-4xl font-black mb-4 transition-all duration-300"
          style={{ color, textShadow: `0 0 ${blur}px ${color}, 0 0 ${blur * 2}px ${color}, 0 0 ${blur * 3}px ${color}` }}
        >
          {text || 'NEON'}
        </p>
        <div
          className="inline-block px-6 py-3 rounded-2xl transition-all duration-300"
          style={{
            color,
            background: 'rgba(10,15,10,0.8)',
            border: `1px solid ${color}`,
            boxShadow: `0 0 ${blur}px ${color}, 0 0 ${blur * 2}px ${color}`,
          }}
        >
          Box Glow Preview
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <ToolLabel theme={tool.theme}>Glow Color</ToolLabel>
          <div className="flex gap-2">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer bg-transparent" />
            <input type="text" value={color} onChange={e => setColor(e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-sm font-mono outline-none" style={{ background: 'rgba(15,30,15,0.5)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }} />
          </div>
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Preview Text</ToolLabel>
          <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="NEON" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'rgba(15,30,15,0.5)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <ToolLabel theme={tool.theme}>Blur Radius</ToolLabel>
            <span className="text-xs text-green-400">{blur}px</span>
          </div>
          <input type="range" min="0" max="60" value={blur} onChange={e => setBlur(Number(e.target.value))} className="w-full accent-green-400" />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <ToolLabel theme={tool.theme}>Glow Layers</ToolLabel>
            <span className="text-xs text-green-400">{layers}</span>
          </div>
          <input type="range" min="1" max="5" value={layers} onChange={e => setLayers(Number(e.target.value))} className="w-full accent-green-400" />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <ToolLabel theme={tool.theme}>Text Shadow CSS</ToolLabel>
            <button onClick={() => copy('text')} className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-3 rounded-xl text-xs font-mono overflow-auto" style={{ background: 'rgba(15,30,15,0.6)', color: '#86efac', border: '1px solid rgba(74,222,128,0.2)' }}>
{css}
          </pre>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <ToolLabel theme={tool.theme}>Box Shadow CSS</ToolLabel>
            <button onClick={() => copy('box')} className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-3 rounded-xl text-xs font-mono overflow-auto" style={{ background: 'rgba(15,30,15,0.6)', color: '#86efac', border: '1px solid rgba(74,222,128,0.2)' }}>
{boxCss}
          </pre>
        </div>
      </div>
    </ToolCard>
  );
}
