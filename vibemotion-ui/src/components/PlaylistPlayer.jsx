// src/components/PlaylistPlayer.jsx
// Beágyazott Spotify lejátszó (Spotify Embed). Nem igényel OAuth-ot vagy Premiumot:
// a bejelentkezett Spotify-felhasználó teljes számokat hall, a többiek előnézetet.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlaylistPlayer({ playlist, onClose }) {
  return (
    <AnimatePresence>
      {playlist && (
        <motion.div
          key={playlist.id}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl
                       border border-neon-purple/50 bg-[#1a002e]/95 backdrop-blur-md
                       shadow-[0_0_30px_#a855f780] p-3"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-sm text-neon-glow font-semibold truncate pr-4">
                Now playing: {playlist.name}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={playlist.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-300 underline hover:text-white"
                >
                  Open in Spotify
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close player"
                  className="text-gray-300 hover:text-white text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            <iframe
              title={`Spotify player – ${playlist.name}`}
              src={`https://open.spotify.com/embed/playlist/${encodeURIComponent(
                playlist.id
              )}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              style={{ borderRadius: 12, border: 0 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
