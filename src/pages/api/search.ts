import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'query' parameter" });
  }

  const TMDB_API_KEY = process.env.TMDB_API_ACCESS_TOKEN;

  if (!TMDB_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing TMDB API key in environment variables" });
  }
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}`,
      options
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from TMDB" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("TMDB API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
