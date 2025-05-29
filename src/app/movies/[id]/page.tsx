// ✅ This goes in: src/app/movies/[id]/page.tsx
import { notFound } from "next/navigation";
import TrailerEmbed from "@/components/TrailerEmbed";
import WatchlistToggle from "@/components/WatchlistToggle";
import WatchedToggle from "@/components/WatchedToggle";
import UserNotes from "@/components/UserNotes";
import CastGrid from "@/components/CastGrid";
import CrewGrid from "@/components/CrewGrid";
import SimilarMoviesCarousel from "@/components/SimilarMoviesCarousel";

const PLACEHOLDER = "/placeholder.jpg";

// ✅ Fix for generateMetadata — no destructuring
export async function generateMetadata(props: { params: { id: string } }) {
  const param = await props.params;
  const id = await param.id;

  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) return { title: "Movie Not Found" };

  const movie = await res.json();

  return {
    title: movie.title,
    description: movie.overview?.slice(0, 160),
    openGraph: {
      title: movie.title,
      description: movie.overview?.slice(0, 160),
      images: [
        {
          url: `https://image.tmdb.org/t/p/w780${
            movie.backdrop_path || movie.poster_path
          }`,
        },
      ],
    },
  };
}

// ✅ Fix for MoviePage — no destructuring
export default async function MoviePage(props: { params: { id: string } }) {
  const param = await props.params;
  const id = await param.id;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,credits,recommendations`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const movie = await res.json();

  const {
    title,
    overview,
    poster_path,
    backdrop_path,
    genres,
    runtime,
    release_date,
    vote_average,
    tagline,
    videos,
    credits,
    recommendations,
    imdb_id,
  } = movie;

  return (
    <div className="text-white max-w-6xl mx-auto px-4 sm:px-8 py-8">
      {backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
          alt={title}
          className="w-full rounded-xl object-cover max-h-[450px] mb-6"
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : PLACEHOLDER
            }
            alt={title}
            className="rounded-lg shadow-lg w-full object-cover"
          />
          <div className="mt-4 space-y-2">
            <WatchlistToggle movie={movie} />
            <WatchedToggle movieId={movie.id} />
            <UserNotes movieId={movie.id} />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {tagline && <p className="italic text-gray-400 mb-2">"{tagline}"</p>}
          <p className="text-gray-300 text-sm mb-4">{overview}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {genres?.map((g: any) => (
              <span
                key={g.id}
                className="bg-gray-700 text-sm px-3 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-400 space-x-4 mb-4">
            <span>⏱ {runtime} mins</span>
            <span>📅 {release_date?.slice(0, 4)}</span>
            <span>⭐ {vote_average?.toFixed(1)} / 10</span>
          </div>

          <div className="flex gap-4 text-sm mt-4">
            <a
              href={`https://www.themoviedb.org/movie/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View on TMDB
            </a>
            {imdb_id && (
              <a
                href={`https://www.imdb.com/title/${imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline"
              >
                View on IMDb
              </a>
            )}
          </div>
        </div>
      </div>

      {videos?.results?.length > 0 && (
        <div className="mt-10">
          {movie?.videos?.results?.length > 0 && (
            <TrailerEmbed
              videoKey={
                movie.videos.results.find(
                  (v) => v.site === "YouTube" && v.type === "Trailer"
                )?.key
              }
            />
          )}{" "}
        </div>
      )}
      {credits?.cast?.length > 0 && (
        <div className="mt-10">
          {Array.isArray(credits?.cast) && credits.cast.length > 0 && (
            <CastGrid cast={credits.cast} />
          )}{" "}
        </div>
      )}
      {credits?.crew?.length > 0 && (
        <div className="mt-10">
          {Array.isArray(credits?.crew) && credits.crew.length > 0 && (
            <CrewGrid crew={credits.crew} />
          )}{" "}
        </div>
      )}
      {recommendations?.results?.length > 0 && (
        <div className="mt-10">
          <SimilarMoviesCarousel movies={recommendations.results} />
        </div>
      )}
    </div>
  );
}
