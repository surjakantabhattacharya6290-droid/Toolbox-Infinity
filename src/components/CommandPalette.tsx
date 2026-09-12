import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { searchTools, type ToolId, type ToolMeta } from '@/lib/relations';
import { getTheme } from '@/lib/theme';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectTool: (id: ToolId) => void;
}

export function CommandPalette({ open, onClose, onSelectTool }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolMeta[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults(searchTools(''));
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(searchTools(query));
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault();
      onSelectTool(results[activeIdx].id);
      onClose();
    }
  }, [open, results, activeIdx, onClose, onSelectTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[180] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl glass-panel overflow-hidden animate-[modalPop_0.2s_ease-out] shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools... (e.g. JSON, compress, password)"
            className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              No tools found for "{query}"
            </div>
          ) : (
            results.map((tool, idx) => {
              const theme = getTheme(tool.theme);
              const isActive = idx === activeIdx;
              return (
                <button
                  key={tool.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => { onSelectTool(tool.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    isActive ? 'scale-[1.01]' : ''
                  }`}
                  style={isActive
                    ? { background: theme.chipBg, border: `1px solid ${theme.chipBorder}` }
                    : { border: '1px solid transparent' }
                  }
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}` }}
                  >
                    <span className="text-sm" style={{ color: theme.primary }}>{theme.primary.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{tool.name}</p>
                    <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                  </div>
                  {isActive && <CornerDownEnter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">↵</kbd> Select</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">Esc</kbd> Close</span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
