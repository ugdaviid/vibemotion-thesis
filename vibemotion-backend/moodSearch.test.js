// moodSearch.test.js – futtatás: npm test (a vibemotion-backend mappában)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MOOD_QUERIES, queriesFor, mergeResults } from "./moodSearch.js";

const ids = (list) => list.map((p) => p.id);

test("queriesFor: ismert hangulat kis/nagybetűtől és szóközöktől függetlenül megtalálható", () => {
  assert.deepEqual(queriesFor(" MELANCHOLIC "), MOOD_QUERIES.melancholic);
  assert.deepEqual(queriesFor("Late Night"), MOOD_QUERIES["late night"]);
});

test("queriesFor: ismeretlen szövegnél maga a (megtisztított) szöveg a kifejezés", () => {
  assert.deepEqual(queriesFor("  Cyberpunk "), ["Cyberpunk"]);
});

test("minden hangulathoz 2–3 nem üres keresőkifejezés tartozik", () => {
  for (const [mood, queries] of Object.entries(MOOD_QUERIES)) {
    assert.ok(queries.length >= 2 && queries.length <= 3, `${mood}: ${queries.length} kifejezés`);
    assert.ok(queries.every((q) => q.trim().length > 0), `${mood}: üres kifejezés`);
  }
});

test("mergeResults: a listákat felváltva fésüli össze", () => {
  const a = [{ id: "a1" }, { id: "a2" }];
  const b = [{ id: "b1" }, { id: "b2" }];
  assert.deepEqual(ids(mergeResults([a, b])), ["a1", "b1", "a2", "b2"]);
});

test("mergeResults: a duplikátumokat (azonos id) kiszűri", () => {
  const a = [{ id: 1 }, { id: 2 }];
  const b = [{ id: 2 }, { id: 3 }];
  assert.deepEqual(ids(mergeResults([a, b])), [1, 2, 3]);
});

test("mergeResults: a megadott maximumnál megáll", () => {
  const a = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const b = [{ id: 4 }, { id: 5 }, { id: 6 }];
  assert.equal(mergeResults([a, b], 4).length, 4);
  assert.deepEqual(ids(mergeResults([a, b], 4)), [1, 4, 2, 5]);
});

test("mergeResults: a null és az id nélküli elemeket kihagyja", () => {
  const a = [null, { id: 1 }, {}];
  assert.deepEqual(ids(mergeResults([a])), [1]);
});

test("mergeResults: üres bemenetre üres listát ad", () => {
  assert.deepEqual(mergeResults([]), []);
  assert.deepEqual(mergeResults([[], []]), []);
});

test("mergeResults: ha az egyik keresés üres, a többi találatai megmaradnak", () => {
  assert.deepEqual(ids(mergeResults([[], [{ id: 1 }, { id: 2 }]])), [1, 2]);
});

// Konzisztencia a frontenddel: a MoodCards.jsx minden hangulatának legyen keresőkifejezése.
// (Ha a frontend mappa nincs a közelben, a teszt kimarad.)
test("a MoodCards.jsx minden hangulatához van keresőkifejezés", (t) => {
  const file = new URL("../vibemotion-ui/src/components/MoodCards.jsx", import.meta.url);
  if (!fs.existsSync(file)) return t.skip("MoodCards.jsx nem található");
  const names = [...fs.readFileSync(file, "utf8").matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(names.length > 0, "nem találtam hangulatokat a fájlban");
  const missing = names.filter((n) => !(n.toLowerCase() in MOOD_QUERIES));
  assert.deepEqual(missing, [], `Hiányzó kulcs a moodSearch.js-ben: ${missing.join(", ")}`);
});
