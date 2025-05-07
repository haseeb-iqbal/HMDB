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
  console.log(res);
  return (
    <div>
      <Image
        key={movieRes.id}
        src={`https://image.tmdb.org/t/p/w500${movieRes.poster_path}`}
        alt={movieRes.original_title}
        width={300}
        height={450}
        className="rounded-lg"
      />
      <p></p>
    </div>
  );
}
