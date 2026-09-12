import { useState, useRef } from 'react';
import { Upload, FileImage, Download, Trash2, GripVertical, Plus } from 'lucide-react';
import { ToolCard, ToolButton } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';
import jsPDF from 'jspdf';

const tool = TOOL_MAP['multi-image-pdf'];

interface ImageItem {
  id: number;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export function MultiImagePdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragId, setDragId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const idRef = useRef(0);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          setImages(prev => [...prev, {
            id: ++idRef.current,
            name: file.name,
            dataUrl: e.target?.result as string,
            width: img.width,
            height: img.height,
          }]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const reorder = (fromId: number, toId: number) => {
    setImages(prev => {
      const fromIdx = prev.findIndex(i => i.id === fromId);
      const toIdx = prev.findIndex(i => i.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  const removeImage = (id: number) => {
    setImages(prev => prev.filter(i => i.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);
    try {
      const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (i > 0) pdf.addPage();

        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        const format = img.dataUrl.includes('image/png') ? 'PNG' : 'JPEG';
        pdf.addImage(img.dataUrl, format, x, y, w, h, undefined, 'FAST');
      }

      pdf.save(`toolbox-infinity-${Date.now()}.pdf`);
      playChime();
      pushToast(`PDF compiled with ${images.length} images! +5 tokens`, 'success');
      rewardToolUse('multi-image-pdf');
    } catch {
      pushToast('Failed to generate PDF', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ToolCard tool={tool}>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => document.getElementById('pdf-upload')?.click()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:scale-[1.01] mb-4"
        style={{ borderColor: 'rgba(34,211,238,0.3)', background: 'rgba(34,211,238,0.05)' }}
      >
        <Upload className="w-10 h-10 mx-auto mb-2 text-cyan-400" />
        <p className="text-sm text-cyan-200">Drop images here or click to browse</p>
        <p className="text-xs text-cyan-500/50 mt-1">PNG, JPG, WEBP — compiled client-side</p>
        <input id="pdf-upload" type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => setDragId(img.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => { if (dragId !== null) reorder(dragId, img.id); setDragId(null); }}
                className="group relative rounded-xl overflow-hidden border border-cyan-400/20 bg-slate-900/50"
              >
                <img src={img.dataUrl} alt={img.name} className="w-full h-28 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] text-cyan-200 truncate max-w-full px-2">{img.name}</span>
                  <button onClick={() => removeImage(img.id)} className="p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute top-1 left-1 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                    <GripVertical className="w-2.5 h-2.5" />{idx + 1}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={() => document.getElementById('pdf-upload')?.click()}
              className="rounded-xl border-2 border-dashed border-cyan-400/20 flex items-center justify-center h-28 hover:border-cyan-400/50 transition-colors"
            >
              <Plus className="w-6 h-6 text-cyan-400/50" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-300/70">{images.length} image{images.length !== 1 ? 's' : ''} ready</span>
            <ToolButton onClick={generatePdf} disabled={generating} theme={tool.theme}>
              {generating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  Compiling...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </span>
              )}
            </ToolButton>
          </div>
        </>
      )}
    </ToolCard>
  );
}
