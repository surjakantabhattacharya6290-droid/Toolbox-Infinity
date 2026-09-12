import { useState, useMemo } from 'react';
import { Tags, Copy, Check } from 'lucide-react';
import { ToolCard, ToolButton, ToolLabel, ToolInput } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['meta-tag-generator'];

export function MetaTagGenerator() {
  const [data, setData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    image: '',
    twitterCard: 'summary_large_image',
    ogType: 'website',
  });

  const [copied, setCopied] = useState(false);

  const tags = useMemo(() => {
    const lines: string[] = [];
    if (data.title) lines.push(`<title>${data.title}</title>`);
    if (data.description) lines.push(`<meta name="description" content="${data.description}" />`);
    if (data.keywords) lines.push(`<meta name="keywords" content="${data.keywords}" />`);
    if (data.author) lines.push(`<meta name="author" content="${data.author}" />`);
    if (data.url) lines.push(`<meta name="url" content="${data.url}" />`);
    lines.push(`<meta name="robots" content="index, follow" />`);
    lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`);
    // Open Graph
    if (data.title) lines.push(`<meta property="og:title" content="${data.title}" />`);
    if (data.description) lines.push(`<meta property="og:description" content="${data.description}" />`);
    if (data.url) lines.push(`<meta property="og:url" content="${data.url}" />`);
    if (data.image) lines.push(`<meta property="og:image" content="${data.image}" />`);
    lines.push(`<meta property="og:type" content="${data.ogType}" />`);
    // Twitter
    lines.push(`<meta name="twitter:card" content="${data.twitterCard}" />`);
    if (data.title) lines.push(`<meta name="twitter:title" content="${data.title}" />`);
    if (data.description) lines.push(`<meta name="twitter:description" content="${data.description}" />`);
    if (data.image) lines.push(`<meta name="twitter:image" content="${data.image}" />`);
    return lines.join('\n');
  }, [data]);

  const copy = () => {
    navigator.clipboard.writeText(tags);
    setCopied(true);
    playChime();
    pushToast('Meta tags copied!', 'success');
    rewardToolUse('meta-tag-generator');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolCard tool={tool}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <ToolLabel theme={tool.theme}>Page Title</ToolLabel>
          <ToolInput value={data.title} onChange={v => setData(d => ({ ...d, title: v }))} placeholder="My Awesome Page" theme={tool.theme} />
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Author</ToolLabel>
          <ToolInput value={data.author} onChange={v => setData(d => ({ ...d, author: v }))} placeholder="Your name" theme={tool.theme} />
        </div>
        <div className="sm:col-span-2">
          <ToolLabel theme={tool.theme}>Description</ToolLabel>
          <textarea
            value={data.description}
            onChange={e => setData(d => ({ ...d, description: e.target.value }))}
            placeholder="Brief description of your page (150-160 chars recommended)"
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-y"
            style={{ background: 'rgba(30,20,40,0.5)', color: '#fdf4ff', border: '1px solid rgba(240,171,252,0.25)' }}
          />
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Keywords (comma-separated)</ToolLabel>
          <ToolInput value={data.keywords} onChange={v => setData(d => ({ ...d, keywords: v }))} placeholder="react, tools, utility" theme={tool.theme} />
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Canonical URL</ToolLabel>
          <ToolInput value={data.url} onChange={v => setData(d => ({ ...d, url: v }))} placeholder="https://example.com" theme={tool.theme} />
        </div>
        <div>
          <ToolLabel theme={tool.theme}>OG Image URL</ToolLabel>
          <ToolInput value={data.image} onChange={v => setData(d => ({ ...d, image: v }))} placeholder="https://example.com/og.png" theme={tool.theme} />
        </div>
        <div>
          <ToolLabel theme={tool.theme}>OG Type</ToolLabel>
          <select
            value={data.ogType}
            onChange={e => setData(d => ({ ...d, ogType: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(30,20,40,0.5)', color: '#fdf4ff', border: '1px solid rgba(240,171,252,0.25)' }}
          >
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
            <option value="profile">profile</option>
          </select>
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Twitter Card Type</ToolLabel>
          <select
            value={data.twitterCard}
            onChange={e => setData(d => ({ ...d, twitterCard: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(30,20,40,0.5)', color: '#fdf4ff', border: '1px solid rgba(240,171,252,0.25)' }}
          >
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
            <option value="player">player</option>
            <option value="app">app</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <ToolLabel theme={tool.theme}>Generated Meta Tags</ToolLabel>
          <ToolButton onClick={copy} theme={tool.theme} variant="ghost">
            <span className="flex items-center gap-1.5">{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy</span>
          </ToolButton>
        </div>
        <pre className="p-4 rounded-xl text-xs font-mono overflow-auto max-h-64" style={{ background: 'rgba(30,20,40,0.6)', color: '#f0abfc', border: '1px solid rgba(240,171,252,0.2)' }}>
{tags}
        </pre>
      </div>
    </ToolCard>
  );
}
