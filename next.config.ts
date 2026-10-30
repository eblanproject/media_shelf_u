import type { NextConfig } from "next";

// Для GitHub Pages сайт собирается как статика (output: "export").
// Включается только в CI переменной GITHUB_PAGES=true — локально всё работает как раньше.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "media_shelf_u";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  ...(isGithubPages && {
    output: "export",
    basePath: `/${repoName}`,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
