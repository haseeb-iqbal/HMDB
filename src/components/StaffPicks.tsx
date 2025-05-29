// src/components/StaffPicks.tsx
"use client";
import SectionCarousel from "./SectionCarousel";

type Movie = { id: number; title: string; poster_path: string | null };

export default function StaffPicks({ movies }: { movies: Movie[] }) {
  return <SectionCarousel title="Staff Picks" movies={movies} />;
}
