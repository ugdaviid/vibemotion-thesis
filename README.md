# 🎧 Vibemotion

A mood-based playlist recommender built as part of my **Bachelor's Thesis in Computer Science**.
The user picks a mood (Happy, Chill, Jazz, Workout, …) and gets matching Spotify playlists in an
immersive, animated interface.

## Tech stack
- **Frontend:** React 18 (Create React App), Tailwind CSS, Framer Motion, React Router
- **Auth:** Supabase (email + password, Google, Spotify)
- **Backend:** Node.js + Express (Spotify Web API proxy, Client Credentials flow)

## Project structure
```
vibemotion-ui/        React app (src/pages, src/components, src/context, src/api.js)
vibemotion-backend/   Express server (server.js)
```

## Run locally

### 1. Backend
```bash
cd vibemotion-backend
cp .env.example .env     # then fill in SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET
npm install
npm run dev              # http://localhost:5000
```

### 2. Frontend
```bash
cd vibemotion-ui
cp .env.example .env     # then fill in the Supabase URL and anon key
npm install
npm start                # http://localhost:3000
```

### Supabase setup
In the Supabase dashboard (Authentication → URL Configuration) add your frontend origin
(e.g. `http://localhost:3000`) to the allowed **Redirect URLs**. Enable the Google and Spotify
providers if you want social login.

## API
`GET /api/playlists?mood=<keyword>` → up to 12 Spotify playlists matching the keyword.

> ⚠️ Never commit `.env` files. The Spotify client secret must only live in the backend.
