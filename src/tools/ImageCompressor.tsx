import { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { ToolCard, ToolButton, ToolLabel, ToolStat } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['image-compressor'];

interface CompressedResult {
  originalUrl: string;
  originalSize: number;
  compressedUrl: string;
  compressedSize: number;
  name: string;
}

function formatKB(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export function ImageCompressor() {
  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [result, setResult] = useState<CompressedResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const originalUrl = e.target?.result as string;
      const originalSize = file.size;
      const img = new Image();
      img.onload = () => {
        setProcessing(true);
        // Strict index 0 logic: single canvas, single thread
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d', { alpha: true })!;

        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) { setProcessing(false); return; }
            const compressedUrl = URL.createObjectURL(blob);
            const compressedSize = blob.size;
            setResult({ originalUrl, originalSize, compressedUrl, compressedSize, name: file.name });
            setProcessing(false);
            playChime();
            pushToast('Image compressed! +5 tokens', 'success');
            rewardToolUse('image-compressor');
          },
          'image/jpeg',
          quality / 100
        );
      };
      img.src = originalUrl;
    };
    reader.readAsDataURL(file);
  };

  const savings = result ? Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100)) : 0;

  return (
    <ToolCard tool={tool}>
      <canvas ref={canvasRef} className="hidden" />

      <div
        onClick={() => document.getElementById('compress-upload')?.click()}
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:scale-[1.01] mb-5"
        style={{ borderColor: 'rgba(34,211,238,0.3)', background: 'rgba(34,211,238,0.05)' }}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
        <p className="text-sm text-cyan-200">Drop an image or click to browse</p>
        <input id="compress-upload" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <ToolLabel theme={tool.theme}>Quality: {quality}%</ToolLabel>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-cyan-500/50 mt-1">
            <span>Smallest</span><span>Best</span>
          </div>
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Max Width: {maxWidth}px</ToolLabel>
          <input
            type="range"
            min="320"
            max="3840"
            step="160"
            value={maxWidth}
            onChange={e => setMaxWidth(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-cyan-500/50 mt-1">
            <span>320px</span><span>4K</span>
          </div>
        </div>
      </div>

      {processing && (
        <div className="text-center py-4">
          <div className="w-8 h-8 mx-auto border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-xs text-cyan-300 mt-2">Compressing via canvas engine...</p>
        </div>
      )}

      {result && !processing && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <ToolStat label="Original" value={formatKB(result.originalSize)} theme={tool.theme} />
            <ToolStat label="Optimized" value={formatKB(result.compressedSize)} theme={tool.theme} />
            <ToolStat label="Saved" value={`${savings}%`} theme={tool.theme} />
            <ToolStat label="Quality" value={`${quality}%`} theme={tool.theme} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl overflow-hidden border border-cyan-400/20">
              <p className="text-[10px] uppercase tracking-wider text-cyan-400/60 px-3 py-1.5 bg-cyan-500/5">Original</p>
              <img src={result.originalUrl} alt="original" className="w-full h-40 object-contain bg-slate-950/50" />
            </div>
            <div className="rounded-xl overflow-hidden border border-cyan-400/20">
              <p className="text-[10px] uppercase tracking-wider text-cyan-400/60 px-3 py-1.5 bg-cyan-500/5">Optimized</p>
              <img src={result.compressedUrl} alt="compressed" className="w-full h-40 object-contain bg-slate-950/50" />
            </div>
          </div>

          <div className="flex justify-end">
            <ToolButton onClick={() => {
              const a = document.createElement('a');
              a.href = result.compressedUrl;
              a.download = `compressed-${result.name}`;
              a.click();
            }} theme={tool.theme}>
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Optimized
              </span>
            </ToolButton>
          </div>
        </>
      )}
    </ToolCard>
  );
}
