// src/types/index.ts
// Shared lightweight domain types.

export type Video = {
  key: string;
  type: string;
  site?: string;
};

export type Movie = {
  id: number;
  title: string;
  overview?: string;
  tagline?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average?: number;
  videos?: { results: Video[] };
};
