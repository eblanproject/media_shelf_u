import type { NextConfig } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Запросы из браузера к /api/movies, /api/tv, /api/search проксируются на бэкенд.
  // Так браузер обращается к своему же домену и CORS на бэкенде не нужен.
  async rewrites() {
    if (!API_URL) return [];
    return [
      { source: "/api/movies/:path*", destination: `${API_URL}/api/movies/:path*` },
      { source: "/api/movies", destination: `${API_URL}/api/movies` },
      { source: "/api/tv/:path*", destination: `${API_URL}/api/tv/:path*` },
      { source: "/api/tv", destination: `${API_URL}/api/tv` },
      { source: "/api/search", destination: `${API_URL}/api/search` },
    ];
  },
};

export default nextConfig;
