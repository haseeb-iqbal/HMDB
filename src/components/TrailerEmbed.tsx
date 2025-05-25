"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  videos: Array<{ key: string; site: string; type: string }>;
};

export default function TrailerEmbed({ videos }: Props) {
  const trailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const [play, setPlay] = useState(false);

  if (!trailer) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`;

  return (
    <div className="aspect-video w-full relative rounded overflow-hidden">
      {!play ? (
        <button
          onClick={() => setPlay(true)}
          className="w-full h-full relative bg-black"
        >
          <Image
            src={thumbnailUrl}
            alt="Trailer thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          src={embedUrl}
          title="Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
}
