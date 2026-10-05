// src/api.js
import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/** Spotify playlistek lekérése hangulat (kulcsszó) alapján a saját backendünkön át. */
export async function fetchPlaylists(mood) {
  const { data } = await axios.get(`${API_URL}/api/playlists`, {
    params: { mood }, // az axios gondoskodik az URL-kódolásról
  });
  return data.filter(Boolean);
}
