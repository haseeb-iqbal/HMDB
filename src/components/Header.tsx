"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only flip mounted to true on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800">
      <Image src="/logo.webp" alt="Logo" width={120} height={40} priority />

      {/* Don’t even render a <button> until mounted === true */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      )}
    </header>
  );
}
