import Image from "next/image";

export default async function MovieDetail({
  params,
}: {
  params: { id: string };
}) {
  type MovieResponse = {
    id: number;
    original_title: string;
    poster_path: string;
    release_date: string;
    overview: string;
    genres: { id: number; name: string }[];
    runtime: number;
    tagline: string;
    vote_average: number;
    vote_count: number;
  };
  const param = await params; // {locale: "id"}
  const id = await param.id; // id
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.TMDB_API_ACCESS_TOKEN,
    },
  };
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, options);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const movieRes: MovieResponse = await res.json();
  const movieYear = movieRes.release_date.split("-")[0];
  const movieRating = Math.round(movieRes.vote_average * 10) / 10;
  console.log(res);
  return (
    <div>
      <div className="flex flex-row gap-5 mt-10">
        <Image
          key={movieRes.id}
          src={`https://image.tmdb.org/t/p/w500${movieRes.poster_path}`}
          alt={movieRes.original_title}
          width={300}
          height={450}
          className="rounded-lg"
        />
        <div className="max-w-[900px] flex flex-col gap-3">
          <div className="flex flex-row items-end">
            <h1 className="text-5xl">{movieRes.original_title}</h1>
            <p className="text-2xl ml-1 text-gray-300">({movieYear})</p>
          </div>
          <div className="flex flex-row gap-1 items-center text-gray-400">
            <p className="text-sm">{movieRes.runtime} minutes</p>
            <p className="text-sm">|</p>
            {movieRes.genres.map((genre) => {
              return (
                <p key={genre.id} className="text-sm">
                  ○ {genre.name}
                </p>
              );
            })}
          </div>
          <p>Rating: {movieRating}/10</p>
          <p className="text-2xl text-gray-300">{movieRes.tagline}</p>
          <p>
            {movieRes.overview} {movieRes.overview}
            {movieRes.overview}
          </p>
        </div>
      </div>
    </div>
  );
}
