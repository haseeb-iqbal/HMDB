"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Review = {
  id: number;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  has_spoilers: boolean;
  created_at: string;
};

export default function ReviewList({ movieId }: { movieId: number }) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);

  useEffect(() => {
    // Fetch all reviews for this movie
    supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false })
      .then(({ data, count }) => {
        if (data) {
          setReviews(data);
          // compute average
          const sum = data.reduce((s, r) => s + r.rating, 0);
          setAvgRating(data.length ? sum / data.length : 0);
        }
      });
  }, [movieId, supabase]);

  return (
    <div className="mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">User Reviews</h2>
        <p className="text-gray-400">
          Average: <span className="font-bold">{avgRating.toFixed(1)}</span> /
          10 ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">
                {r.user_id.slice(0, 6)}… {/* placeholder for username */}
              </span>
              <span className="font-bold">{r.rating} / 10</span>
            </div>
            {r.title && <h3 className="italic mb-1">{r.title}</h3>}
            {r.has_spoilers && (
              <span className="text-red-400 text-xs mr-2">Spoilers</span>
            )}
            <p className="text-sm">{r.body}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
