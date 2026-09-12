export type ToolId =
  | 'image-compressor'
  | 'multi-image-pdf'
  | 'word-counter'
  | 'age-calculator'
  | 'json-formatter'
  | 'password-generator'
  | 'meta-tag-generator'
  | 'gst-emi-calculator'
  | 'css-neon-generator'
  | 'url-shortener-qr';

export const RELATIONS: Record<ToolId, ToolId[]> = {
  'image-compressor': ['multi-image-pdf', 'url-shortener-qr', 'css-neon-generator'],
  'multi-image-pdf': ['image-compressor', 'meta-tag-generator', 'word-counter'],
  'word-counter': ['meta-tag-generator', 'age-calculator', 'json-formatter'],
  'age-calculator': ['word-counter', 'gst-emi-calculator', 'meta-tag-generator'],
  'json-formatter': ['url-shortener-qr', 'meta-tag-generator', 'password-generator'],
  'password-generator': ['json-formatter', 'gst-emi-calculator', 'word-counter'],
  'meta-tag-generator': ['word-counter', 'multi-image-pdf', 'json-formatter'],
  'gst-emi-calculator': ['password-generator', 'age-calculator', 'word-counter'],
  'css-neon-generator': ['json-formatter', 'image-compressor', 'url-shortener-qr'],
  'url-shortener-qr': ['json-formatter', 'css-neon-generator', 'image-compressor'],
};

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  theme: ThemeFamily;
  category: string;
}

export type ThemeFamily = 'cyberpunk' | 'gold-minimal' | 'pastel' | 'glass' | 'matrix';

export const TOOLS: ToolMeta[] = [
  { id: 'multi-image-pdf', name: 'Multi-Image to PDF', shortName: 'Image→PDF', description: 'Compile multiple images into a high-fidelity PDF', icon: 'FileImage', theme: 'cyberpunk', category: 'Media Converters' },
  { id: 'image-compressor', name: 'Image Compressor', shortName: 'Compress', description: 'Compress images with live quality tuning', icon: 'Minimize2', theme: 'cyberpunk', category: 'Compression' },
  { id: 'word-counter', name: 'Word Counter Matrix', shortName: 'Word Count', description: 'Real-time word, character & reading time analysis', icon: 'Type', theme: 'pastel', category: 'Text Engineering' },
  { id: 'age-calculator', name: 'Age & Date Calculator', shortName: 'Age Calc', description: 'Precise age and date difference telemetry', icon: 'Calendar', theme: 'glass', category: 'Daily Utilities' },
  { id: 'json-formatter', name: 'JSON Formatter', shortName: 'JSON', description: 'Format, validate & explore JSON data', icon: 'Braces', theme: 'matrix', category: 'Code Formatters' },
  { id: 'password-generator', name: 'Password Generator', shortName: 'Password', description: 'Cryptographically secure password generation', icon: 'KeyRound', theme: 'gold-minimal', category: 'Security Tools' },
  { id: 'meta-tag-generator', name: 'Meta Tag Generator', shortName: 'Meta Tags', description: 'Generate SEO & Open Graph meta tags', icon: 'Tags', theme: 'pastel', category: 'SEO Optimization' },
  { id: 'gst-emi-calculator', name: 'GST / EMI Calculator', shortName: 'EMI Calc', description: 'Tax, GST & loan EMI calculations', icon: 'Calculator', theme: 'gold-minimal', category: 'Math Tools' },
  { id: 'css-neon-generator', name: 'CSS Neon Generator', shortName: 'Neon CSS', description: 'Design box-shadow & neon glow effects', icon: 'Sparkles', theme: 'matrix', category: 'Web Developers' },
  { id: 'url-shortener-qr', name: 'URL Shortener + QR', shortName: 'URL/QR', description: 'Shorten URLs & generate QR codes', icon: 'Link2', theme: 'glass', category: 'Link Utilities' },
];

export const TOOL_MAP: Record<ToolId, ToolMeta> = Object.fromEntries(
  TOOLS.map(t => [t.id, t])
) as Record<ToolId, ToolMeta>;

export function getRelatedTools(id: ToolId): ToolMeta[] {
  return (RELATIONS[id] || []).map(rid => TOOL_MAP[rid]).filter(Boolean);
}
