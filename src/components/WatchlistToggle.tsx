"use client";

import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function WatchlistToggle({ movieId }: { movieId: number }) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("watchlists")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("movie_id", movieId)
      .then(({ data }) => setAdded(!!data?.length));
  }, [session, movieId, supabase]);

  const toggle = async () => {
    if (!session) return;
    if (added) {
      await supabase
        .from("watchlists")
        .delete()
        .match({ user_id: session.user.id, movie_id: movieId });
    } else {
      await supabase
        .from("watchlists")
        .insert({ user_id: session.user.id, movie_id: movieId });
    }
    setAdded(!added);
  };
  return (
    <button
      onClick={toggle}
      disabled={!session}
      className={`px-4 py-2 rounded ${added ? "bg-red-600" : "bg-gray-600"}`}
    >
      {added ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
}
