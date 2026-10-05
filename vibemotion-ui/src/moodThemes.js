// src/moodThemes.js
// Színséma kategóriánként. A színválasztás a színpszichológiát követi:
//  - meleg, telített színek (sárga/narancs, piros) = magas energia, öröm, aktivitás
//  - hideg, telítetlen színek (kék, szürkéskék) = nyugalom, melankólia, visszafogottság
// Az egyes hangulatokhoz kategórián keresztül rendelődik szín (lásd MoodCards.jsx).
// Ha egy hangulatnak egyedi színt szeretnél, add hozzá a MOOD_THEME_OVERRIDES-hoz.

export const DEFAULT_THEME = {
  id: "default",
  from: "#000000",
  via: "#1a002e",
  to: "#3b0066",
  accent: "#c084fc",
};

export const CATEGORY_THEMES = {
  Joy: { id: "joy", from: "#000000", via: "#4a2800", to: "#b45309", accent: "#fcd34d" },
  Relax: { id: "relax", from: "#000000", via: "#022c2a", to: "#0f766e", accent: "#5eead4" },
  Sad: { id: "sad", from: "#000000", via: "#0f172a", to: "#334155", accent: "#94a3b8" },
  Study: { id: "study", from: "#000000", via: "#062a40", to: "#0369a1", accent: "#7dd3fc" },
  Workout: { id: "workout", from: "#000000", via: "#3b0a0a", to: "#b91c1c", accent: "#f87171" },
  Romance: { id: "romance", from: "#000000", via: "#3b0a1e", to: "#be123c", accent: "#fda4af" },
  Fun: { id: "fun", from: "#000000", via: "#3a0640", to: "#c026d3", accent: "#f0abfc" },
  Chill: { id: "chill", from: "#000000", via: "#140a3a", to: "#4338ca", accent: "#a5b4fc" },
  Adventure: { id: "adventure", from: "#000000", via: "#0a2a12", to: "#15803d", accent: "#86efac" },
};

// Hangulat-specifikus felülírások (név kisbetűvel), pl.:
// winter: { id: "winter", from: "#000000", via: "#0c2233", to: "#38bdf8", accent: "#e0f2fe" },
export const MOOD_THEME_OVERRIDES = {};

export function themeForMood(mood) {
  if (!mood) return DEFAULT_THEME;
  const override = MOOD_THEME_OVERRIDES[mood.name.toLowerCase()];
  return override ?? CATEGORY_THEMES[mood.category] ?? DEFAULT_THEME;
}
