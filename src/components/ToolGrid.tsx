import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TOOLS, type ToolId, type ToolCategory } from '@/lib/relations';
import { getTheme } from '@/lib/theme';
import { playChime } from '@/lib/audio';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { useState } from 'react';

interface ToolGridProps {
  onSelectTool: (id: ToolId) => void;
  category: ToolCategory;
  favorites: string[];
  onToggleFavorite: (id: ToolId) => void;
}

export function ToolGrid({ onSelectTool, category, favorites, onToggleFavorite }: ToolGridProps) {
  const filtered = category === 'all' ? TOOLS : TOOLS.filter(t => t.category === category);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((tool, idx) => {
        const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[tool.icon] ?? Icons.Box;
        const theme = getTheme(tool.theme);
        const fav = favorites.includes(tool.id);
        return (
          <div
            key={tool.id}
            className="group glass-card rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => { onSelectTool(tool.id); playChime(600, 900); }}
          >
            {/* Hover glow layer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)` }}
            />

            {/* Top neon line */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }}
            />

            {/* Favorite star */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool.id); }}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors z-10"
              title={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {fav
                ? <Icons.Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                : <Icons.Star className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              }
            </button>

            <div className="relative">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${theme.chipBg}, rgba(15,20,35,0.4))`,
                  border: `1px solid ${theme.chipBorder}`,
                  boxShadow: `0 0 12px ${theme.glow}`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: theme.primary }} />
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{tool.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tool.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: theme.chipBg, color: theme.chipText, border: `1px solid ${theme.chipBorder}` }}
                >
                  {tool.categoryLabel}
                </span>
                <Icons.ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
