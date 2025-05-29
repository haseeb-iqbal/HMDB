// src/components/SurpriseMe.tsx
"use client";
import { useRouter } from "next/navigation";

export default function SurpriseMe({ pool }: { pool: any[] }) {
  const router = useRouter();
  const pick = () => {
    const rand = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/movies/${rand.id}`);
  };
  return (
    <div className="text-center py-8">
      <button
        onClick={pick}
        className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg"
      >
        🎲 Surprise Me!
      </button>
    </div>
  );
}
