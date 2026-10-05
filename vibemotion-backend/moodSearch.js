// moodSearch.js
// Hangulat -> Spotify keresőkifejezések. Hangulatonként több kifejezést futtatunk,
// és az eredményeket összefésüljük, így relevánsabb és változatosabb a lista.
// A kifejezések szabadon szerkeszthetők – ha egy hangulat találatai nem tetszenek, itt kell átírni.

export const MOOD_QUERIES = {
  happy: ["happy hits", "feel good", "happy songs"],
  chill: ["chill vibes", "chill hits", "lofi chill"],
  sad: ["sad songs", "sad indie", "heartbreak"],
  focus: ["deep focus", "focus flow", "lofi beats study"],
  energy: ["energy boost", "high energy", "pump up"],
  love: ["love songs", "love hits", "in love"],
  party: ["party hits", "party mix", "dance party"],
  calm: ["calm vibes", "peaceful", "calming music"],
  motivation: ["motivation mix", "motivational workout", "motivation hits"],
  sleepy: ["sleep", "sleep music", "peaceful sleep"],
  epic: ["epic music", "epic cinematic", "epic orchestral"],
  romantic: ["romantic", "romantic dinner", "romantic songs"],
  melancholic: ["melancholic", "melancholy indie", "rainy day"],
  summer: ["summer hits", "summer vibes", "summer feel good"],
  winter: ["winter vibes", "cozy winter", "winter chill"],
  nature: ["nature sounds", "forest ambient", "peaceful nature"],
  workout: ["workout", "gym motivation", "workout hits"],
  gaming: ["gaming music", "gaming mix", "electronic gaming"],
  "happy vibes": ["happy vibes", "good vibes", "feel good vibes"],
  "late night": ["late night", "late night drive", "night vibes"],
  morning: ["morning", "good morning", "morning coffee"],
  drive: ["driving", "road trip", "night drive"],
  mystery: ["mystery", "dark ambient", "suspense soundtrack"],
  "relaxing piano": ["relaxing piano", "peaceful piano", "piano chill"],
  rock: ["rock hits", "classic rock", "rock mix"],
  indie: ["indie", "indie chill", "indie hits"],
  classical: ["classical", "classical essentials", "classical focus"],
  jazz: ["jazz", "chill jazz", "jazz classics"],
  electronic: ["electronic", "electronic hits", "electronic essentials"],
  meditation: ["meditation music", "mindfulness", "zen"],
};

/** A hangulathoz tartozó kifejezések; ismeretlen szövegnél (pl. a keresősávból) maga a szöveg. */
export function queriesFor(mood) {
  return MOOD_QUERIES[mood.trim().toLowerCase()] ?? [mood.trim()];
}

/**
 * Több találati listát fésül össze felváltva (1. lista 1. eleme, 2. lista 1. eleme, ...),
 * duplikátumok nélkül (playlist id alapján), legfeljebb `max` elemig.
 */
export function mergeResults(lists, max = 12) {
  const seen = new Set();
  const out = [];

  for (let i = 0; out.length < max; i++) {
    let any = false;
    for (const list of lists) {
      if (i >= list.length) continue;
      any = true;
      const p = list[i];
      if (p && p.id && !seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
        if (out.length >= max) break;
      }
    }
    if (!any) break;
  }
  return out;
}
