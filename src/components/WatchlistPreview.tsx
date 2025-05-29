// src/components/WatchlistPreview.tsx
"use client";
import { useEffect, useState } from "react";
import SectionCarousel from "./SectionCarousel";
import { getWatchlist } from "@/lib/watchlistUtils";

export default function WatchlistPreview() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    setList(getWatchlist());
  }, []);
  if (!list.length) {
    return (
      <div className="px-4 py-8 text-center text-gray-400">
        ♥ Your watchlist is empty. Add movies to see them here.
      </div>
    );
  }
  return <SectionCarousel title="Your Watchlist" movies={list} />;
}
