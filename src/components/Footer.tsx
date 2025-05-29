// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 text-sm p-6 text-center">
      <p>© {new Date().getFullYear()} MyMovieApp. Data from TMDB.</p>
      <div className="space-x-4 mt-2">
        <a href="https://github.com/you" target="_blank">
          GitHub
        </a>
        <a href="https://linkedin.com/in/you" target="_blank">
          LinkedIn
        </a>
      </div>
      <p className="mt-4">Built with Next.js & Tailwind CSS</p>
    </footer>
  );
}
