// src/app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionCarousel from "@/components/SectionCarousel";
import WatchlistPreview from "@/components/WatchlistPreview";
import SurpriseMe from "@/components/SurpriseMe";
import InfiniteFeed from "@/components/InfiniteFeed";
import StaffPicks from "@/components/StaffPicks";
import Footer from "@/components/Footer";
import { fetchFromTMDB } from "@/lib/tmdb";

export default async function Page() {
  // 1) Hero (pick a “Movie of the Day”)
  const heroData = await fetchFromTMDB("/movie/popular?page=1");
  const heroMovie = heroData.results[0];

  // 2) Carousels
  const [nowPlaying, topRated, trending, upcoming] = await Promise.all([
    fetchFromTMDB("/movie/now_playing"),
    fetchFromTMDB("/movie/top_rated"),
    fetchFromTMDB("/trending/movie/week"),
    fetchFromTMDB("/movie/upcoming"),
  ]).then((arr) => arr.map((d) => d.results));

  // 3) Staff Picks (manually curate OR take first 5 topRated)
  const staffPicks = topRated.slice(0, 5);

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <Header />
      <Hero movie={heroMovie} />

      <SectionCarousel title="Now Playing" movies={nowPlaying} />
      <SectionCarousel title="Top Rated" movies={topRated} />
      <SectionCarousel title="Trending" movies={trending} />
      <SectionCarousel title="Upcoming" movies={upcoming} />

      <WatchlistPreview />

      <SurpriseMe pool={nowPlaying.concat(trending)} />

      <InfiniteFeed />

      <StaffPicks movies={staffPicks} />

      <Footer />
    </main>
  );
}
