"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function WatchlistToggle({ movieId }: { movieId: number }) {
  const [supabaseUser, setSupabaseUser] = useState<User>();
  const supabase = createClient();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      if (session.data.user) {
        setSupabaseUser(session.data.user);
      }
    });
  }, []);

  useEffect(() => {
    if (!supabaseUser) return;
    supabase
      .from("watchlists")
      .select("id")
      .eq("user_id", supabaseUser.id)
      .eq("movie_id", movieId)
      .then(({ data }) => setAdded(!!data?.length));
  }, [supabaseUser, movieId, supabase]);

  const toggle = async () => {
    if (!supabaseUser) return;
    if (added) {
      await supabase
        .from("watchlists")
        .delete()
        .match({ user_id: supabaseUser.id, movie_id: movieId });
    } else {
      await supabase
        .from("watchlists")
        .insert({ user_id: supabaseUser.id, movie_id: movieId });
    }
    setAdded(!added);
  };
  return (
    <button
      onClick={toggle}
      disabled={!supabaseUser}
      className={`px-4 py-2 rounded ${added ? "bg-red-600" : "bg-gray-600"}`}
    >
      {added ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
}
