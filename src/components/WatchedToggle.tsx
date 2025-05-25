"use client";

import { useState, useEffect } from "react";

type Props = { movieId: number };

const STORAGE_KEY = "watchedMovies";

export default function WatchedToggle({ movieId }: Props) {
  const [watched, setWatched] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const match = parsed.find((m: any) => m.id === movieId);
      if (match) {
        setWatched(true);
        setRating(match.rating || null);
      }
    }
  }, [movieId]);

  const updateStorage = (updated: any[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleToggle = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    const updated = watched
      ? list.filter((m: any) => m.id !== movieId)
      : [...list, { id: movieId, rating }];
    updateStorage(updated);
    setWatched(!watched);
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    const existing = localStorage.getItem(STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    const updated = list.map((m: any) =>
      m.id === movieId ? { ...m, rating: value } : m
    );
    updateStorage(updated);
  };

  return (
    <div className="bg-gray-700 px-3 py-2 rounded text-sm space-y-2">
      <button onClick={handleToggle} className="text-white w-full">
        {watched ? "✓ Marked as Watched" : "Mark as Watched"}
      </button>
      {watched && (
        <div className="text-gray-300 flex items-center justify-between">
          <label htmlFor="rating" className="mr-2">
            Your Rating:
          </label>
          <input
            id="rating"
            type="number"
            min={1}
            max={10}
            value={rating ?? ""}
            onChange={(e) => handleRatingChange(Number(e.target.value))}
            className="w-16 bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded"
          />
        </div>
      )}
    </div>
  );
}
