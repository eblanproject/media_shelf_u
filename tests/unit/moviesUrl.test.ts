import { describe, expect, it } from "vitest";
import { moviesUrl } from "@/lib/api/movies";

describe("moviesUrl", () => {
  it("первая страница без page и genre", () => {
    expect(moviesUrl()).toBe("/api/movies?category=popular&count=20");
  });

  it("добавляет page со второй страницы и жанр", () => {
    expect(moviesUrl({ category: "top_rated", count: 20, page: 2, genre: 28 })).toBe(
      "/api/movies?category=top_rated&count=20&page=2&genre=28",
    );
  });

  it("genre null не попадает в адрес", () => {
    expect(moviesUrl({ genre: null, page: 1 })).toBe("/api/movies?category=popular&count=20");
  });
});
