// src/lib/watchlistUtils.ts

export type StoredMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

const STORAGE_KEY = "recentSearches";
const WATCHLIST_KEY = "movieWatchlist";

export function getRecentSearches(): StoredMovie[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveRecentSearch(movie: StoredMovie) {
  const recent = getRecentSearches();
  const filtered = recent.filter((m) => m.id !== movie.id);
  const updated = [movie, ...filtered].slice(0, 6);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeRecentSearch(id: number) {
  const recent = getRecentSearches().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  return recent;
}

// Optional watchlist support
export function getWatchlist(): StoredMovie[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function toggleWatchlist(movie: StoredMovie) {
  const list = getWatchlist();
  const exists = list.some((m) => m.id === movie.id);
  const updated = exists
    ? list.filter((m) => m.id !== movie.id)
    : [movie, ...list];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
}

export function isInWatchlist(id: number) {
  return getWatchlist().some((m) => m.id === id);
}
