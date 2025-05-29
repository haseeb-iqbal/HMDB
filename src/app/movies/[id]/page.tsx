// src/app/movies/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import TrailerEmbed from "@/components/TrailerEmbed";
import WatchlistToggle from "@/components/WatchlistToggle";
import WatchedToggle from "@/components/WatchedToggle";
import UserNotes from "@/components/UserNotes";
import CastGrid from "@/components/CastGrid";
import CrewGrid from "@/components/CrewGrid";
import SimilarMoviesCarousel from "@/components/SimilarMoviesCarousel";

const PLACEHOLDER = "/placeholder.jpg";

export async function generateMetadata(props: { params: { id: string } }) {
  const id = props.params.id;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}` },
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

export default async function MoviePage(props: { params: { id: string } }) {
  const id = props.params.id;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,credits,recommendations`,
    {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}` },
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
      {/* Backdrop */}
      {backdrop_path && (
        <div className="relative w-full h-[450px] mb-6 rounded-xl overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster & Toggles */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="relative w-full">
            <Image
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : PLACEHOLDER
              }
              alt={title}
              width={500}
              height={750}
              className="rounded-lg shadow-lg w-full object-cover"
              priority
            />
          </div>
          <div className="space-y-2">
            <WatchlistToggle movieId={movie.id} />
            <WatchedToggle movieId={movie.id} />
            <UserNotes movieId={movie.id} />
          </div>
        </div>

        {/* Details */}
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

      {/* Trailer */}
      {videos?.results?.length > 0 && (
        <div className="mt-10">
          <TrailerEmbed
            videoKey={
              videos.results.find(
                (v: any) => v.site === "YouTube" && v.type === "Trailer"
              )?.key
            }
          />
        </div>
      )}

      {/* Cast */}
      {credits?.cast?.length > 0 && (
        <div className="mt-10">
          <CastGrid cast={credits.cast} />
        </div>
      )}

      {/* Crew */}
      {credits?.crew?.length > 0 && (
        <div className="mt-10">
          <CrewGrid crew={credits.crew} />
        </div>
      )}

      {/* Similar */}
      {recommendations?.results?.length > 0 && (
        <div className="mt-10">
          <SimilarMoviesCarousel movies={recommendations.results} />
        </div>
      )}
    </div>
  );
}
