"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import genreKeywords from "@/lib/genreUtils"; // We'll build this next
import {
  removeRecentSearch,
  saveRecentSearch,
  getRecentSearches,
} from "@/lib/watchlistUtils"; // We'll build this next
import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [recent, setRecent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = getRecentSearches();
    setRecent(stored);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(searchTerm), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // Check if it's a genre keyword
      const lower = debounced.trim().toLowerCase();
      const genreId = genreKeywords[lower];

      const endpoint = genreId
        ? `/discover/movie?with_genres=${genreId}`
        : `/search/movie?query=${encodeURIComponent(debounced)}`;

      const res = await fetch(
        `/api/tmdb?endpoint=${encodeURIComponent(endpoint)}`
      );
      const data = await res.json();

      setResults(Array.isArray(data.results) ? data.results.slice(0, 6) : []);
      setLoading(false);
    };

    fetchData();
  }, [debounced]);

  // Click outside to close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const clearInput = () => {
    setSearchTerm("");
    setDebounced("");
    setResults([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      router.push(
        `/searchResults?query=${encodeURIComponent(searchTerm.trim())}`
      );
      setShowDropdown(false);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    saveRecentSearch(movie);
    router.push(`/movies/${movie.id}`);
  };

  const handleRemoveRecent = (id: number) => {
    const updated = removeRecentSearch(id);
    setRecent(updated);
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="flex items-center bg-gray-700 rounded px-3 py-2">
        <MdSearch className="text-white mr-2" />
        <input
          type="text"
          placeholder="Search movies or genres…"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        />
        {searchTerm && (
          <button onClick={clearInput}>
            <IoClose className="text-white text-xl ml-2" />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul className="absolute w-full mt-2 bg-gray-800 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchTerm.trim() && results.length > 0 ? (
            <>
              <li className="px-4 py-2 text-sm font-semibold text-gray-300 border-b border-gray-700">
                Results
              </li>
              {results.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-3 items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelect(movie)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : PLACEHOLDER_IMAGE
                    }
                    className="w-10 h-14 object-cover rounded"
                    alt={movie.title}
                  />
                  <div>
                    <p className="font-medium text-white">{movie.title}</p>
                    {movie.release_date && (
                      <p className="text-xs text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
              <li className="px-4 py-2 text-blue-400 hover:underline text-sm">
                <Link
                  href={`/searchResults?query=${encodeURIComponent(
                    searchTerm
                  )}`}
                >
                  View all results for “{searchTerm}”
                </Link>
              </li>
            </>
          ) : !searchTerm && recent.length > 0 ? (
            <>
              <li className="px-4 py-2 text-sm font-semibold text-gray-300 border-b border-gray-700">
                Recent Searches
              </li>
              {recent.map((movie) => (
                <li
                  key={movie.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-700"
                >
                  <Link
                    href={`/movies/${movie.id}`}
                    className="flex items-center gap-3 w-full"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                          : PLACEHOLDER_IMAGE
                      }
                      className="w-10 h-14 object-cover rounded"
                      alt={movie.title}
                    />
                    <span>{movie.title}</span>
                  </Link>
                  <button onClick={() => handleRemoveRecent(movie.id)}>
                    <IoClose className="text-white text-lg" />
                  </button>
                </li>
              ))}
            </>
          ) : (
            <li className="px-4 py-2 text-sm text-gray-400">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}
