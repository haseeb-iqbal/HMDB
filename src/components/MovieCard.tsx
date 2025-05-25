"use client";

import { useState, useEffect } from "react";
import { toggleWatchlist, isInWatchlist } from "@/lib/watchlistUtils";
import { FaRegHeart, FaHeart } from "react-icons/fa";

type Props = {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date?: string;
    vote_average?: number;
  };
};

const PLACEHOLDER = "/placeholder.jpg";

export default function MovieCard({ movie }: Props) {
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setInWatchlist(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleToggle = () => {
    toggleWatchlist(movie);
    setInWatchlist((prev) => !prev);
  };

  return (
    <div className="relative group bg-gray-900 rounded overflow-hidden shadow hover:shadow-lg transition">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : PLACEHOLDER
        }
        alt={movie.title}
        className="w-full h-auto object-cover"
      />

      <div className="absolute top-2 right-2 z-10">
        <button onClick={handleToggle}>
          {inWatchlist ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-white text-lg" />
          )}
        </button>
      </div>

      <div className="p-3 text-sm">
        <h3 className="font-semibold truncate">{movie.title}</h3>
        {movie.release_date && (
          <p className="text-xs text-gray-400">
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
        {movie.vote_average && (
          <p className="text-xs text-yellow-400 mt-1">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
}
