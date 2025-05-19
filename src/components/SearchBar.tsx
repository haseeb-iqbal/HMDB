"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import InputBase from "@mui/material/InputBase";
import { MdSearch } from "react-icons/md";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounce input
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Fetch search results
  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${debounced}`);
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results.slice(0, 5) : []);
      } catch (err) {
        console.error("Failed to fetch TMDB data:", err);
      }
      setLoading(false);
    };

    fetchResults();
  }, [debounced]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResults([]);
        setHighlightedIndex(-1);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            const selected = results[highlightedIndex];
            window.location.href = `/movies/${selected.id}`;
          }
          break;
      }
    },
    [results, highlightedIndex]
  );

  return (
    <div className="relative w-full max-w-md ml-12" ref={containerRef}>
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
            setLoading(false);
            setSearchTerm(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          inputProps={{ "aria-label": "search" }}
          sx={{ color: "white", flex: 1 }}
        />
      </Box>

      {/* Animated Dropdown */}
      {results.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 w-full mt-2 bg-gray-800 text-white rounded shadow-lg max-h-72 overflow-y-auto z-50 transition-all duration-200 animate-fade-in"
        >
          {results.map((movie, index) => (
            <li
              key={movie.id}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition ${
                index === highlightedIndex ? "bg-gray-700" : ""
              }`}
            >
              <Link
                href={`/movies/${movie.id}`}
                className="flex items-center w-full gap-3"
              >
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{movie.title}</span>
                  {movie.release_date && (
                    <span className="text-sm text-gray-400">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
