// src/lib/watchlistUtils.ts

const STORAGE_KEY = "recentSearches";
const WATCHLIST_KEY = "movieWatchlist";

export function getRecentSearches() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveRecentSearch(movie: any) {
  const recent = getRecentSearches();
  const filtered = recent.filter((m: any) => m.id !== movie.id);
  const updated = [movie, ...filtered].slice(0, 6);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeRecentSearch(id: number) {
  const recent = getRecentSearches().filter((m: any) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  return recent;
}

// Optional watchlist support
export function getWatchlist(): any[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function toggleWatchlist(movie: any) {
  const list = getWatchlist();
  const exists = list.some((m: any) => m.id === movie.id);
  const updated = exists
    ? list.filter((m: any) => m.id !== movie.id)
    : [movie, ...list];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
}

export function isInWatchlist(id: number) {
  return getWatchlist().some((m: any) => m.id === id);
}
