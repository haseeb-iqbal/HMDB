"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import InputBase from "@mui/material/InputBase";
import { MdSearch } from "react-icons/md";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
};

const MAX_RECENT = 5;
const PLACEHOLDER_IMAGE = "/placeholder.jpg"; // Place this in public/ folder

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<Movie[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setDropdownVisible(true);
      try {
        if (debounced.trim()) {
          const res = await fetch(`/api/search?query=${debounced}`);
          const data = await res.json();
          setResults(
            Array.isArray(data.results) ? data.results.slice(0, 5) : []
          );
        } else {
          const res = await fetch(`/api/search`);
          const data = await res.json();
          setTrending(
            Array.isArray(data.results) ? data.results.slice(0, 5) : []
          );
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setResults([]);
        setTrending([]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [debounced]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
        setHighlightedIndex(-1);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentList = getCurrentList();
      if (!dropdownVisible || currentList.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % currentList.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev === 0 ? currentList.length - 1 : prev - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          const selected = currentList[highlightedIndex];
          if (selected) {
            addToRecent(selected);
            window.location.href = `/movies/${selected.id}`;
          }
          break;
        case "Escape":
          setDropdownVisible(false);
          break;
      }
    },
    [highlightedIndex, dropdownVisible]
  );

  const addToRecent = (movie: Movie) => {
    const newList = [
      movie,
      ...recentSearches.filter((m) => m.id !== movie.id),
    ].slice(0, MAX_RECENT);
    setRecentSearches(newList);
    localStorage.setItem("recentSearches", JSON.stringify(newList));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const getCurrentList = () => {
    if (debounced.trim()) return results;
    return recentSearches.length > 0 ? recentSearches : trending;
  };

  const currentList = getCurrentList();
  const isRecent = !debounced && recentSearches.length > 0;
  const isTrending = !debounced && recentSearches.length === 0;

  const highlightMatch = (text: string) => {
    if (!debounced) return text;
    const regex = new RegExp(`(${debounced})`, "i");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold text-yellow-400">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="relative w-full max-w-md ml-4 sm:ml-12 sm:max-w-md"
      ref={containerRef}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
          },
          borderRadius: 1,
          padding: "0 10px",
          height: "40px",
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
        ) : (
          <MdSearch className="mr-2" />
        )}
        <InputBase
          placeholder="Search movies…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setDropdownVisible(true);
          }}
          onFocus={() => setDropdownVisible(true)}
          onKeyDown={handleKeyDown}
          inputProps={{ "aria-label": "search" }}
          sx={{ color: "white", flex: 1 }}
        />
      </Box>

      {dropdownVisible && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-gray-800 text-white rounded shadow-lg max-h-96 overflow-y-auto z-50 transition-all duration-200 animate-fade-in text-sm sm:text-base">
          {/* Section Header */}
          <li className="px-4 py-2 text-sm font-semibold text-gray-300 border-b border-gray-700">
            {debounced
              ? "Search Results"
              : isRecent
              ? "Recent Searches"
              : "Trending Now"}
          </li>

          {currentList.length > 0 ? (
            currentList.map((movie, index) => (
              <li
                key={movie.id}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition ${
                  index === highlightedIndex ? "bg-gray-700" : ""
                }`}
                onClick={() => addToRecent(movie)}
              >
                <Link
                  href={`/movies/${movie.id}`}
                  className="flex items-center w-full gap-3"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : PLACEHOLDER_IMAGE
                    }
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <span>{highlightMatch(movie.title)}</span>
                    {movie.release_date && (
                      <span className="text-xs text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-400">
              No results found.
            </li>
          )}

          {debounced && (
            <li className="px-4 py-2 text-blue-400 hover:underline text-sm cursor-pointer">
              <Link href={`/results?query=${encodeURIComponent(debounced)}`}>
                View all results for “{debounced}”
              </Link>
            </li>
          )}

          {isRecent && (
            <li className="text-right px-4 py-2 border-t border-gray-700">
              <button
                onClick={clearRecent}
                className="text-xs text-red-400 hover:underline"
              >
                Clear recent searches
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
