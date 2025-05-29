export async function fetchFromTMDB(endpoint: string) {
  // Build the full TMDB URL
  const url = `https://api.themoviedb.org/3${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    // Optional ISR: revalidate every hour
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
