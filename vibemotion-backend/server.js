import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  FRONTEND_URL = "http://localhost:3000,https://localhost:3000",
  PORT = 5000,
} = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error("❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env");
  process.exit(1);
}

const app = express();
app.use(
  cors({ origin: FRONTEND_URL.split(",").map((o) => o.trim()) })
);
app.use(express.json());

/**
 * ================================
 * 🎧 Spotify token (Client Credentials)
 * A tokent a szerver memóriában tartja, és csak lejáratkor kér újat.
 * A token SOHA nem megy ki a böngészőnek.
 * ================================
 */
let cachedToken = { value: null, expiresAt: 0 };

async function getAccessToken() {
  if (cachedToken.value && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // 60 mp biztonsági tartalék a lejárat előtt
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

/**
 * ================================
 * 🎵 Search Spotify playlists
 * GET /api/playlists?mood=chill
 * ================================
 */
app.get("/api/playlists", async (req, res) => {
  const mood = String(req.query.mood ?? "").trim();

  if (!mood) return res.status(400).json({ error: "Mood is required" });
  if (mood.length > 50) {
    return res.status(400).json({ error: "Mood is too long (max 50 characters)" });
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: { q: mood, type: "playlist", limit: 10 },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // A Spotify néha null elemeket ad vissza a listában
    const items = (response.data?.playlists?.items ?? []).filter(Boolean);
    res.json(items);
  } catch (err) {
    console.error("❌ Spotify playlist error:", err.response?.data || err.message);

    // Ha a token érvénytelen lett, a következő kérésnél újat kérünk
    if (err.response?.status === 401) {
      cachedToken = { value: null, expiresAt: 0 };
    }
    res.status(502).json({ error: "Failed to search playlists" });
  }
});

/**
 * ================================
 * 🚀 Server Start
 * ================================
 */
app.listen(PORT, () =>
  console.log(`💜 Spotify Backend running at http://localhost:${PORT}`)
);
