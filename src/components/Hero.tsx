// src/components/Hero.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import TrailerEmbed from "./TrailerEmbed"; // your existing embed
import { Movie } from "@/types"; // define a lightweight type

export default function Hero({ movie }: { movie: Movie }) {
  const [open, setOpen] = useState(false);
  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  return (
    <section
      className="relative h-[60vh] flex items-end text-white"
      style={{ background: `url(${backdrop}) center/cover no-repeat` }}
    >
      <div className="bg-gradient-to-t from-gray-900 p-8 w-full">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        {movie.tagline && <p className="italic mb-4">{movie.tagline}</p>}
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-red-600 rounded"
        >
          ▶ Play Trailer
        </button>
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setOpen(false)}
          >
            <div className="w-11/12 sm:w-3/4 lg:w-1/2">
              <TrailerEmbed
                videoKey={
                  movie.videos?.results?.find((v) => v.type === "Trailer")?.key
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
