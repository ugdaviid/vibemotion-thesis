// src/moodThemes.test.js – futtatás: npm test -- --watchAll=false (a vibemotion-ui mappában)
import {
  themeForMood,
  CATEGORY_THEMES,
  DEFAULT_THEME,
  MOOD_THEME_OVERRIDES,
} from "./moodThemes";
import { moods } from "./components/MoodCards";

const HEX = /^#[0-9a-fA-F]{6}$/;

test("hangulat nélkül az alapértelmezett (lila) téma jár", () => {
  expect(themeForMood(null)).toBe(DEFAULT_THEME);
  expect(themeForMood(undefined)).toBe(DEFAULT_THEME);
});

test("ismeretlen kategóriájú hangulat az alapértelmezett témát kapja", () => {
  expect(themeForMood({ name: "X", category: "NincsIlyen" })).toBe(DEFAULT_THEME);
});

test("minden hangulat kategóriájához tartozik színséma", () => {
  moods.forEach((mood) => {
    expect(CATEGORY_THEMES[mood.category]).toBeDefined();
    expect(themeForMood(mood)).toBe(CATEGORY_THEMES[mood.category]);
  });
});

test("a hangulatok nevei egyediek", () => {
  const names = moods.map((m) => m.name);
  expect(new Set(names).size).toBe(names.length);
});

test("minden színséma érvényes hex színeket tartalmaz", () => {
  [DEFAULT_THEME, ...Object.values(CATEGORY_THEMES)].forEach((theme) => {
    ["from", "via", "to", "accent"].forEach((key) => {
      expect(theme[key]).toMatch(HEX);
    });
  });
});

test("a kategóriák színséma-azonosítói egyediek", () => {
  const themeIds = Object.values(CATEGORY_THEMES).map((t) => t.id);
  expect(new Set(themeIds).size).toBe(themeIds.length);
});

test("a hangulat-specifikus felülírás elsőbbséget élvez a kategória színével szemben", () => {
  const custom = { id: "custom", from: "#000000", via: "#111111", to: "#222222", accent: "#333333" };
  MOOD_THEME_OVERRIDES.happy = custom;
  try {
    expect(themeForMood({ name: "Happy", category: "Joy" })).toBe(custom);
  } finally {
    delete MOOD_THEME_OVERRIDES.happy;
  }
});
