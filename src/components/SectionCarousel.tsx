// src/components/SectionCarousel.tsx
"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import Image from "next/image";

type Movie = { id: number; title: string; poster_path: string | null };

export default function SectionCarousel({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 5, spacing: 12 },
    breakpoints: {
      "(max-width: 640px)": { slides: { perView: 2, spacing: 8 } },
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 10 } },
    },
  });

  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div ref={sliderRef} className="keen-slider overflow-hidden">
        {movies.map((m) => (
          <Link
            key={m.id}
            href={`/movies/${m.id}`}
            className="keen-slider__slide w-[140px] flex-shrink-0"
          >
            <div className="relative w-full h-[210px] rounded overflow-hidden bg-gray-800">
              <Image
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={m.title}
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            <p className="mt-2 text-sm truncate text-white">{m.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
