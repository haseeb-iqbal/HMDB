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
      <h1>HMDB</h1>
      {movieRes.results.map((movie) => {
        const movieLink = getMoviePath(movie.id);
        return (
          <div key={movie.id} className="flex flex-col items-center my-10">
            <Link href={movieLink}>
              <Image
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.original_title}
                width={300}
                height={450}
                className="rounded-lg"
              />
            </Link>
            <Link href={movieLink}>
              <p className="text-2xl mt-3">{movie.original_title}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
