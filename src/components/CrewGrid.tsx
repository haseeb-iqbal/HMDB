"use client";

type Props = {
  crew: Array<{ id: number; job: string; name: string }>;
};

export default function CrewGrid({ crew }: Props) {
  const safeCrew = Array.isArray(crew) ? crew : [];
  const mainCrew = safeCrew.filter((person) =>
    ["Director", "Writer", "Screenplay", "Composer"].includes(person.job)
  );

  const uniqueCrew = Array.from(
    new Map(mainCrew.map((c) => [c.name + c.job, c])).values()
  );
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Key Crew</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {uniqueCrew.map((member) => (
          <div
            key={`${member.id}-${member.job}`}
            className="bg-gray-800 p-3 rounded-lg"
          >
            <p className="font-semibold">{member.name}</p>
            <p className="text-gray-400">{member.job}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
