import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const endpoint = req.nextUrl.searchParams.get("endpoint");

  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: "Missing endpoint query parameter" }),
      { status: 400 }
    );
  }

  const apiKey = process.env.TMDB_API_ACCESS_TOKEN;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing TMDB API key" }), {
      status: 500,
    });
  }

  const url = `https://api.themoviedb.org/3${endpoint}`;

  try {
    const tmdbRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    const data = await tmdbRes.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("TMDB API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from TMDB" }),
      {
        status: 500,
      }
    );
  }
}
