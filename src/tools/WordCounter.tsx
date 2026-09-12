import { useState, useMemo } from 'react';
import { Copy, Trash2, FileText } from 'lucide-react';
import { ToolCard, ToolStat, ToolButton } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['word-counter'];

export function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim()).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    playChime();
    pushToast('Text copied to clipboard!', 'success');
    if (text.trim()) rewardToolUse('word-counter');
  };

  return (
    <ToolCard tool={tool}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <ToolStat label="Words" value={stats.words} theme={tool.theme} />
        <ToolStat label="Characters" value={stats.chars} theme={tool.theme} />
        <ToolStat label="No Spaces" value={stats.charsNoSpaces} theme={tool.theme} />
        <ToolStat label="Sentences" value={stats.sentences} theme={tool.theme} />
        <ToolStat label="Paragraphs" value={stats.paragraphs} theme={tool.theme} />
        <ToolStat label="Reading Time" value={`${stats.readingTime}m`} theme={tool.theme} />
        <ToolStat label="Speaking Time" value={`${stats.speakingTime}m`} theme={tool.theme} />
        <ToolStat label="Avg Word" value={`${stats.words ? Math.round(stats.charsNoSpaces / stats.words) : 0}`} theme={tool.theme} />
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here for real-time analysis..."
          rows={10}
          className="w-full p-4 rounded-2xl text-sm outline-none resize-y transition-all focus:scale-[1.01]"
          style={{
            background: 'rgba(15,10,25,0.6)',
            color: '#fdf4ff',
            border: '1px solid rgba(240,171,252,0.25)',
            lineHeight: '1.6',
          }}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={copyText}
            disabled={!text}
            className="p-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 transition-colors disabled:opacity-40"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setText('')}
            disabled={!text}
            className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors disabled:opacity-40"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-pink-300/50">
        <FileText className="w-3.5 h-3.5" />
        <span>Live analysis updates as you type. Reading speed: 200 wpm, speaking: 130 wpm.</span>
      </div>
    </ToolCard>
  );
}
