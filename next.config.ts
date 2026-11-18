import type { NextConfig } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Старые адреса страниц входа — ведут на актуальные
  async redirects() {
    return [
      { source: "/auth", destination: "/auth/signin", permanent: true },
      { source: "/login", destination: "/auth/signin", permanent: true },
      { source: "/register", destination: "/auth/registration", permanent: true },
    ];
  },

  // Запросы из браузера к /api/movies, /api/tv, /api/search, /api/people, /api/genres проксируются на бэкенд.
  // Так браузер обращается к своему же домену и CORS на бэкенде не нужен.
  async rewrites() {
    if (!API_URL) return [];
    return [
      { source: "/api/movies/:path*", destination: `${API_URL}/api/movies/:path*` },
      { source: "/api/movies", destination: `${API_URL}/api/movies` },
      { source: "/api/tv/:path*", destination: `${API_URL}/api/tv/:path*` },
      { source: "/api/tv", destination: `${API_URL}/api/tv` },
      { source: "/api/genres/:path*", destination: `${API_URL}/api/genres/:path*` },
      { source: "/api/search", destination: `${API_URL}/api/search` },
      { source: "/api/people/:path*", destination: `${API_URL}/api/people/:path*` },
    ];
  },
};

export default nextConfig;
