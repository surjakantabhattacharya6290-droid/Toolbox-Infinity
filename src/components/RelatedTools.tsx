import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getRelatedTools, type ToolId } from '@/lib/relations';
import { getTheme } from '@/lib/theme';

interface RelatedToolsProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

export function RelatedTools({ activeTool, onSelectTool }: RelatedToolsProps) {
  const related = getRelatedTools(activeTool);
  if (related.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <h3 className="text-xs uppercase tracking-widest text-cyan-400/60 font-bold flex items-center gap-2">
          <Icons.Sparkles className="w-3.5 h-3.5" />
          Related Smart Utilities
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map(tool => {
          const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[tool.icon] ?? Icons.Box;
          const theme = getTheme(tool.theme);
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group glass-card rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)` }}
              />
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }} />
              <div className="flex items-start gap-3 relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `linear-gradient(135deg, ${theme.chipBg}, rgba(15,20,35,0.4))`, border: `1px solid ${theme.chipBorder}`, boxShadow: `0 0 10px ${theme.glow}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate text-slate-100">{tool.name}</h4>
                  <p className="text-xs mt-0.5 line-clamp-2 text-slate-400">{tool.description}</p>
                </div>
                <Icons.ArrowRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 text-slate-500" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
