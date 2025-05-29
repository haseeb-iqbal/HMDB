// components/SimilarMoviesCarousel.tsx
"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
};

export default function SimilarMoviesCarousel({ movies }: { movies: Movie[] }) {
  // The second element is a RefObject, whose .current is the slider API
  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 5, spacing: 16 },
    breakpoints: {
      "(max-width: 640px)": { slides: { perView: 2, spacing: 8 } },
      "(min-width: 641px) and (max-width: 1024px)": {
        slides: { perView: 3, spacing: 12 },
      },
    },
  });

  const scrollPrev = () => sliderInstanceRef.current?.prev();
  const scrollNext = () => sliderInstanceRef.current?.next();

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Similar Movies</h2>
        <div className="space-x-2">
          <button
            onClick={scrollPrev}
            className="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
          >
            ◀
          </button>
          <button
            onClick={scrollNext}
            className="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
          >
            ▶
          </button>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider overflow-hidden">
        {movies.map((m) => (
          <Link
            key={m.id}
            href={`/movies/${m.id}`}
            className="keen-slider__slide flex-shrink-0 w-[140px]"
          >
            <div className="relative w-full h-[210px] bg-gray-800 rounded overflow-hidden">
              <Image
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={m.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                priority
              />
            </div>
            <p className="mt-2 text-sm text-white truncate text-center">
              {m.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
