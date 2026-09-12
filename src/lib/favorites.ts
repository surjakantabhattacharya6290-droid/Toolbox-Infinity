export interface FavoriteData {
  favorites: string[];
  recents: string[];
}

const FAV_KEY = 'tbx_favorites';
const RECENT_KEY = 'tbx_recents';
const MAX_RECENTS = 8;

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleFavorite(toolId: string): string[] {
  const favs = getFavorites();
  const idx = favs.indexOf(toolId);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.unshift(toolId);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(toolId: string): boolean {
  return getFavorites().includes(toolId);
}

export function getRecents(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecent(toolId: string): string[] {
  let recents = getRecents();
  recents = recents.filter(id => id !== toolId);
  recents.unshift(toolId);
  recents = recents.slice(0, MAX_RECENTS);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
  return recents;
}
