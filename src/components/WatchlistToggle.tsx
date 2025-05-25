"use client";

import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlistUtils";

type Props = { movie: any };

export default function WatchlistToggle({ movie }: Props) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleClick = () => {
    toggleWatchlist(movie);
    setAdded((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-white bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded w-full"
    >
      {added ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      {added ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
}
