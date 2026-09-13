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
  | 'url-shortener-qr'
  | 'jwt-decoder'
  | 'base64-codec'
  | 'hash-generator'
  | 'url-codec';

export type ToolCategory = 'all' | 'media' | 'pdf' | 'dev' | 'security';

export const RELATIONS: Record<ToolId, ToolId[]> = {
  'image-compressor': ['multi-image-pdf', 'url-shortener-qr', 'css-neon-generator'],
  'multi-image-pdf': ['image-compressor', 'meta-tag-generator', 'word-counter'],
  'word-counter': ['meta-tag-generator', 'age-calculator', 'json-formatter'],
  'age-calculator': ['word-counter', 'gst-emi-calculator', 'meta-tag-generator'],
  'json-formatter': ['url-shortener-qr', 'meta-tag-generator', 'password-generator', 'jwt-decoder', 'base64-codec'],
  'password-generator': ['json-formatter', 'gst-emi-calculator', 'word-counter', 'hash-generator'],
  'meta-tag-generator': ['word-counter', 'multi-image-pdf', 'json-formatter'],
  'gst-emi-calculator': ['password-generator', 'age-calculator', 'word-counter'],
  'css-neon-generator': ['json-formatter', 'image-compressor', 'url-shortener-qr'],
  'url-shortener-qr': ['json-formatter', 'css-neon-generator', 'image-compressor', 'url-codec'],
  'jwt-decoder': ['json-formatter', 'base64-codec', 'hash-generator'],
  'base64-codec': ['jwt-decoder', 'json-formatter', 'url-codec'],
  'hash-generator': ['password-generator', 'jwt-decoder', 'base64-codec'],
  'url-codec': ['url-shortener-qr', 'base64-codec', 'json-formatter'],
};

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  theme: ThemeFamily;
  category: ToolCategory;
  categoryLabel: string;
  keywords: string[];
}

export type ThemeFamily = 'cyberpunk' | 'gold-minimal' | 'pastel' | 'glass' | 'matrix';

export const TOOLS: ToolMeta[] = [
  { id: 'image-compressor', name: 'Image Compressor', shortName: 'Compress', description: 'Compress images with live quality tuning', icon: 'Minimize2', theme: 'cyberpunk', category: 'media', categoryLabel: 'Media & Image', keywords: ['image', 'compress', 'resize', 'optimize', 'jpg', 'png', 'webp'] },
  { id: 'multi-image-pdf', name: 'Multi-Image to PDF', shortName: 'Image to PDF', description: 'Compile multiple images into a high-fidelity PDF', icon: 'FileImage', theme: 'cyberpunk', category: 'pdf', categoryLabel: 'PDF & Documents', keywords: ['pdf', 'image', 'convert', 'merge', 'jpg', 'png'] },
  { id: 'word-counter', name: 'Word Counter', shortName: 'Word Count', description: 'Real-time word, character & reading time analysis', icon: 'Type', theme: 'pastel', category: 'dev', categoryLabel: 'Developer & Text', keywords: ['word', 'count', 'character', 'text', 'reading', 'seo'] },
  { id: 'age-calculator', name: 'Age Calculator', shortName: 'Age Calc', description: 'Precise age and date difference calculator', icon: 'Calendar', theme: 'glass', category: 'dev', categoryLabel: 'Daily Utilities', keywords: ['age', 'date', 'birthday', 'calculator', 'days'] },
  { id: 'json-formatter', name: 'JSON Formatter', shortName: 'JSON', description: 'Format, validate & explore JSON data', icon: 'Braces', theme: 'matrix', category: 'dev', categoryLabel: 'Developer & JSON', keywords: ['json', 'format', 'beautify', 'validate', 'parse', 'minify'] },
  { id: 'password-generator', name: 'Password Generator', shortName: 'Password', description: 'Cryptographically secure password generation', icon: 'KeyRound', theme: 'gold-minimal', category: 'security', categoryLabel: 'Security & Crypto', keywords: ['password', 'secure', 'random', 'generator', 'strong'] },
  { id: 'meta-tag-generator', name: 'Meta Tag Generator', shortName: 'Meta Tags', description: 'Generate SEO & Open Graph meta tags', icon: 'Tags', theme: 'pastel', category: 'dev', categoryLabel: 'SEO Optimization', keywords: ['meta', 'seo', 'og', 'twitter', 'html', 'tags'] },
  { id: 'gst-emi-calculator', name: 'GST / EMI Calculator', shortName: 'EMI Calc', description: 'Tax, GST & loan EMI calculations', icon: 'Calculator', theme: 'gold-minimal', category: 'dev', categoryLabel: 'Math Tools', keywords: ['gst', 'emi', 'loan', 'tax', 'calculator', 'finance'] },
  { id: 'css-neon-generator', name: 'CSS Neon Generator', shortName: 'Neon CSS', description: 'Design box-shadow & neon glow effects', icon: 'Sparkles', theme: 'matrix', category: 'dev', categoryLabel: 'Web Developers', keywords: ['css', 'neon', 'glow', 'shadow', 'design', 'style'] },
  { id: 'url-shortener-qr', name: 'URL Shortener + QR', shortName: 'URL/QR', description: 'Shorten URLs & generate QR codes', icon: 'Link2', theme: 'glass', category: 'media', categoryLabel: 'Link Utilities', keywords: ['url', 'shorten', 'qr', 'code', 'link'] },
  { id: 'jwt-decoder', name: 'JWT Decoder', shortName: 'JWT', description: 'Decode JWT tokens and inspect header/payload', icon: 'LockKeyhole', theme: 'matrix', category: 'security', categoryLabel: 'Security & Crypto', keywords: ['jwt', 'token', 'decode', 'auth', 'bearer', 'json web token'] },
  { id: 'base64-codec', name: 'Base64 Encoder/Decoder', shortName: 'Base64', description: 'Encode and decode Base64 strings instantly', icon: 'Binary', theme: 'matrix', category: 'dev', categoryLabel: 'Developer & JSON', keywords: ['base64', 'encode', 'decode', 'convert', 'binary'] },
  { id: 'hash-generator', name: 'Hash Generator', shortName: 'Hash', description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes', icon: 'Fingerprint', theme: 'gold-minimal', category: 'security', categoryLabel: 'Security & Crypto', keywords: ['hash', 'sha', 'sha256', 'sha512', 'digest', 'checksum', 'crypto'] },
  { id: 'url-codec', name: 'URL Encoder/Decoder', shortName: 'URL Codec', description: 'Encode and decode URL-safe strings', icon: 'Link', theme: 'glass', category: 'dev', categoryLabel: 'Developer & JSON', keywords: ['url', 'encode', 'decode', 'percent', 'uri', 'escape'] },
];

export const TOOL_MAP: Record<ToolId, ToolMeta> = Object.fromEntries(
  TOOLS.map(t => [t.id, t])
) as Record<ToolId, ToolMeta>;

export function getRelatedTools(id: ToolId): ToolMeta[] {
  return (RELATIONS[id] || []).map(rid => TOOL_MAP[rid]).filter(Boolean);
}

export const CATEGORIES: { id: ToolCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Tools', icon: 'LayoutGrid' },
  { id: 'media', label: 'Media & Image', icon: 'Image' },
  { id: 'pdf', label: 'PDF & Documents', icon: 'FileText' },
  { id: 'dev', label: 'Developer & JSON', icon: 'Code2' },
  { id: 'security', label: 'Security & Crypto', icon: 'ShieldCheck' },
];

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.includes(q)) ||
    t.categoryLabel.toLowerCase().includes(q)
  );
}
