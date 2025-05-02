export default async function MovieDetail({
  params,
}: {
  params: { id: string };
}) {
  const param = await params; // {locale: "id"}
  const id = await param.id; // id
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.TMDB_API_ACCESS_TOKEN,
    },
  };
  let response = await fetch("https://api.themoviedb.org/3/movie/550", options);
  response = await response.json();
  console.log(response);
  return (
    <div>
      <h1>The movie ID is {id}</h1>
      <p></p>
    </div>
  );
}
