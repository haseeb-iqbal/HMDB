"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import MovieCard from "@/components/MovieCard";
import genreKeywords from "@/lib/genreUtils";

type Genre = {
  id: number;
  name: string;
};

export default function SearchResultsPage() {
  const params = useSearchParams();
  const query = params.get("query") || "";
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sort, setSort] = useState("popularity.desc");
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchGenres = async () => {
    const res = await fetch("/api/tmdb?endpoint=/genre/movie/list");
    const data = await res.json();
    setGenres(data.genres || []);
  };

  const getApiUrl = () => {
    const genreId =
      genreKeywords[query.toLowerCase()] || selectedGenre || undefined;

    const isPerson =
      !genreId && query && query.toLowerCase().startsWith("actor ");

    if (isPerson) {
      const personName = query.replace(/^actor\s+/i, "").trim();
      return `/search/person?query=${encodeURIComponent(personName)}`;
    }

    if (genreId) {
      return `/discover/movie?with_genres=${genreId}&sort_by=${sort}&page=${page}`;
    }

    return `/search/movie?query=${encodeURIComponent(
      query
    )}&sort_by=${sort}&page=${page}`;
  };

  const fetchMovies = useCallback(async () => {
    if (!query) return;
    setLoading(true);

    const res = await fetch(
      `/api/tmdb?endpoint=${encodeURIComponent(getApiUrl())}`
    );
    const data = await res.json();

    const newMovies = data.results || [];
    setMovies((prev) => [...prev, ...newMovies]);
    setHasMore(newMovies.length > 0);
    setLoading(false);
  }, [query, page, selectedGenre, sort]);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [query, selectedGenre, sort]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [hasMore, loading]);

  return (
    <div className="px-4 py-6 text-white">
      <h1 className="text-xl font-bold mb-4">
        Results for <span className="text-yellow-400">"{query}"</span>
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="bg-gray-700 text-white px-3 py-2 rounded"
          value={selectedGenre || ""}
          onChange={(e) =>
            setSelectedGenre(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="bg-gray-700 text-white px-3 py-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest Releases</option>
          <option value="original_title.asc">Title A–Z</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="py-10 text-center">
        {loading && <p className="text-sm text-gray-400">Loading more...</p>}
        {!hasMore && !loading && (
          <p className="text-sm text-gray-500 mt-4">No more results.</p>
        )}
      </div>
    </div>
  );
}
