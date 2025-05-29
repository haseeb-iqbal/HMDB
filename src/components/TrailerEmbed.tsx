"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

type Props = {
  videoKey?: string;
};

export default function TrailerEmbed({ videoKey }: Props) {
  const [play, setPlay] = useState(false);
  const embedUrl = useMemo(() => {
    if (!videoKey) return null;
    return `https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&mute=1`;
  }, [videoKey]);

  const thumbnailUrl = videoKey
    ? `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`
    : "";

  if (!videoKey) return null;
  return (
    <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
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
            sizes="100vw"
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
          key={videoKey}
          src={embedUrl!}
          title="YouTube Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full absolute top-0 left-0"
        />
      )}
    </div>
  );
}
