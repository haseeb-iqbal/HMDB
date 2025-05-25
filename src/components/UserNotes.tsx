"use client";

import { useState, useEffect } from "react";

type Props = { movieId: number };

const STORAGE_KEY = "movieNotes";

export default function UserNotes({ movieId }: Props) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotes(parsed[movieId] || "");
    }
  }, [movieId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[movieId] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  };

  return (
    <div className="bg-gray-700 px-3 py-2 rounded">
      <label htmlFor="notes" className="text-sm text-white block mb-1">
        Notes
      </label>
      <textarea
        id="notes"
        rows={3}
        value={notes}
        onChange={handleChange}
        placeholder="Add your thoughts..."
        className="w-full bg-gray-800 text-white text-sm p-2 rounded resize-none focus:outline-none"
      />
    </div>
  );
}
