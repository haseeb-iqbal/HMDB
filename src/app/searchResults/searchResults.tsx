// src/app/results/page.tsx

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    };
    if (query) fetchData();
  }, [query]);

  return (
    <div className="px-6 py-8 text-white">
      <h1 className="text-xl font-bold mb-4">
        Results for: <span className="text-yellow-400">{query}</span>
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {results.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="bg-gray-900 p-2 rounded hover:bg-gray-700 transition">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                      : "/placeholder.jpg"
                  }
                  alt={movie.title}
                  className="w-full h-auto object-cover rounded"
                />
                <p className="mt-2 text-sm">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
