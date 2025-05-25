"use client";

const PLACEHOLDER = "/placeholder.jpg";

type Props = {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
};

export default function CastGrid({ cast }: Props) {
  const safeCast = Array.isArray(cast) ? cast : [];
  const topCast = safeCast.slice(0, 12);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Top Cast</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {topCast.map((actor) => (
          <div key={actor.id} className="text-center text-sm">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : PLACEHOLDER
              }
              alt={actor.name}
              className="w-full h-40 object-cover rounded-lg mb-1"
            />
            <p className="font-semibold">{actor.name}</p>
            <p className="text-gray-400 text-xs">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
