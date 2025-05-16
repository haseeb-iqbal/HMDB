import Image from "next/image";
import Link from "next/link";
import { getMoviePath } from "@/lib/routes";
type Movie = {
  id: number;
  original_title: string;
  poster_path: string;
};

type MoviesResponse = {
  results: Movie[];
};

export default async function Home() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.TMDB_API_ACCESS_TOKEN,
    },
  };

  const res = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US",
    options
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const movieRes: MoviesResponse = await res.json();
  console.log(movieRes);
  return (
    <div className="mt-4 text-center text-6xl">
      <div className="flex items-center flex-wrap justify-center items-end gap-x-10 gap-y-10">
        {movieRes.results.map((movie) => {
          const movieLink = getMoviePath(movie.id);
          return (
            <div key={movie.id} className="flex flex-col items-center w-40">
              <Link href={movieLink}>
                <Image
                  key={movie.id}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.original_title}
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </Link>
              <Link href={movieLink} className="px-1 py-2 h-18 text-xl">
                {movie.original_title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
