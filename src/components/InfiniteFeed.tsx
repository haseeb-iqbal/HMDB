// src/components/InfiniteFeed.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  // add any other fields MovieCard needs, e.g. release_date, vote_average, etc.
};

export default function InfiniteFeed() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const loader = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(async () => {
    const res = await fetch(
      `/api/tmdb?endpoint=${encodeURIComponent(`/movie/popular?page=${page}`)}`
    );
    if (!res.ok) throw new Error("Failed to load movies");
    const data = await res.json();

    setMovies((prev) => {
      // only add those not already in `prev`
      const newResults = data.results.filter(
        (r: Movie) => !prev.some((existing) => existing.id === r.id)
      );
      return [...prev, ...newResults];
    });
  }, [page]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Browse All</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((m) => (
          <Link
            key={m.id}
            href={`/movies/${m.id}`}
            className="block hover:scale-105 transition-transform"
          >
            <MovieCard movie={m} />
          </Link>
        ))}
      </div>
      <div ref={loader} className="h-8 text-center text-gray-500">
        Loading…
      </div>
    </section>
  );
}
