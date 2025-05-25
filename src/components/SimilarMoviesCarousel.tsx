"use client";

import Link from "next/link";

const PLACEHOLDER = "/placeholder.jpg";

type Props = {
  movies: Array<{
    id: number;
    title: string;
    poster_path: string | null;
  }>;
};

export default function SimilarMoviesCarousel({ movies }: Props) {
  if (!movies?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Similar Movies</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {movies.slice(0, 15).map((movie) => (
          <Link
            href={`/movies/${movie.id}`}
            key={movie.id}
            className="flex-shrink-0 w-32"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                  : PLACEHOLDER
              }
              alt={movie.title}
              className="w-full h-48 object-cover rounded-lg mb-1"
            />
            <p className="text-xs text-center">{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
