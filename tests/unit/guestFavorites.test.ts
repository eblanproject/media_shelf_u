import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GUEST_FAVORITES_KEY,
  getGuestFavorites,
  parseGuestFavorites,
  removeGuestFavorites,
  subscribeGuestFavorites,
  toggleGuestFavorite,
} from "@/lib/favorites/guestFavorites";

beforeEach(() => {
  localStorage.clear();
});

describe("parseGuestFavorites", () => {
  it("пустое или битое значение — пустой список", () => {
    expect(parseGuestFavorites(null)).toEqual([]);
    expect(parseGuestFavorites("not json")).toEqual([]);
    expect(parseGuestFavorites('{"a":1}')).toEqual([]);
  });

  it("оставляет только положительные целые id без повторов", () => {
    expect(parseGuestFavorites('[3, "x", 3, -1, 1.5, 7]')).toEqual([3, 7]);
  });
});

describe("guest favorites", () => {
  it("toggle добавляет в начало и убирает повторным нажатием", () => {
    toggleGuestFavorite(1);
    toggleGuestFavorite(2);
    expect(getGuestFavorites()).toEqual([2, 1]);

    toggleGuestFavorite(1);
    expect(getGuestFavorites()).toEqual([2]);
    expect(JSON.parse(localStorage.getItem(GUEST_FAVORITES_KEY)!)).toEqual([2]);
  });

  it("пока данные не менялись, возвращает тот же массив (нужно для useSyncExternalStore)", () => {
    toggleGuestFavorite(5);
    expect(getGuestFavorites()).toBe(getGuestFavorites());
  });

  it("removeGuestFavorites убирает перенесённые, пустой список стирает ключ", () => {
    toggleGuestFavorite(1);
    toggleGuestFavorite(2);
    removeGuestFavorites([1, 2]);
    expect(getGuestFavorites()).toEqual([]);
    expect(localStorage.getItem(GUEST_FAVORITES_KEY)).toBeNull();
  });

  it("оповещает подписчиков", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeGuestFavorites(listener);
    toggleGuestFavorite(9);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
