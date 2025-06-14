"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ReviewForm({ movieId }: { movieId: number }) {
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      if (session.data.user) {
        setSupabaseUser(session.data.user);
      }
    });
  }, []);

  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<User>();

  // If the user already reviewed, load it
  useEffect(() => {
    if (!supabaseUser) return;
    supabase
      .from("reviews")
      .select("*")
      .eq("user_id", supabaseUser.id)
      .eq("movie_id", movieId)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setRating(data.rating);
          setTitle(data.title || "");
          setBody(data.body || "");
          setHasSpoilers(data.has_spoilers);
        }
      });
  }, [supabaseUser, movieId, supabase]);

  const handleSubmit = async () => {
    if (!supabaseUser) return;
    setLoading(true);

    const payload = {
      user_id: supabaseUser.id,
      movie_id: movieId,
      rating,
      title: title.trim(),
      body: body.trim(),
      has_spoilers: hasSpoilers,
    };

    // Upsert to honor the unique(user_id, movie_id) constraint
    const { error } = await supabase
      .from("reviews")
      .upsert(payload, { onConflict: ["user_id", "movie_id"] });

    if (error) {
      console.error("Review save error:", error);
      // TODO: show user-facing error
    }

    setLoading(false);
  };

  if (!supabaseUser) {
    return (
      <p className="text-gray-400">
        <a href="/auth" className="text-blue-400 hover:underline">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold">Your Review</h2>
      <div>
        <label className="block text-sm text-gray-300">Rating (1–10)</label>
        <input
          type="number"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-16 p-1 rounded bg-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Review</label>
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="flex items-center text-sm">
        <input
          type="checkbox"
          checked={hasSpoilers}
          onChange={() => setHasSpoilers(!hasSpoilers)}
          id="spoilers"
          className="mr-2"
        />
        <label htmlFor="spoilers">Contains spoilers</label>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
      >
        Submit Review
      </button>
    </div>
  );
}
