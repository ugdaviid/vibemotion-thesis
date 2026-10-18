import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { fetchPlaylists } from "../api";

function SearchBar({ onSelectPlaylist }) {
  const [mood, setMood] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef(null);
  const cacheRef = useRef({}); // keresés -> találatok
  const requestIdRef = useRef(0); // elavult válaszok eldobására

  // ================================
  // Load playlists (with cache)
  // ================================
  const loadPlaylists = useCallback(async (value) => {
    const requestId = ++requestIdRef.current;
    const query = value.trim();

    if (!query) {
      setPlaylists([]);
      setStatus("idle");
      setShowDropdown(false);
      return;
    }

    const key = query.toLowerCase();
    if (cacheRef.current[key]) {
      setPlaylists(cacheRef.current[key]);
      setStatus("success");
      setShowDropdown(true);
      return;
    }

    setStatus("loading");
    setShowDropdown(true);

    try {
      const items = await fetchPlaylists(query);
      if (requestId !== requestIdRef.current) return; // közben újabb keresés indult
      cacheRef.current[key] = items;
      setPlaylists(items);
      setStatus("success");
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error fetching playlists:", error);
      setPlaylists([]);
      setStatus("error");
    }
  }, []);

  // Debounce (egyszer jön létre, nem minden rendernél)
  const debouncedLoad = useMemo(
    () => debounce(loadPlaylists, 300),
    [loadPlaylists]
  );

  // Komponens eltűnésekor a függőben lévő hívás törlése
  useEffect(() => () => debouncedLoad.cancel(), [debouncedLoad]);

  // Input change
  const handleChange = (e) => {
    const value = e.target.value;
    setMood(value);

    if (!value.trim()) {
      debouncedLoad.cancel();
      loadPlaylists("");
      return;
    }

    // Azonnali visszajelzés a gépelés közben (a tényleges keresés 300 ms múlva indul)
    setStatus("loading");
    setShowDropdown(true);
    debouncedLoad(value);
  };

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto mt-6 sm:mt-10"
    >
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Enter a mood (happy, chill, sad...)"
          value={mood}
          onChange={handleChange}
          onFocus={() => status !== "idle" && setShowDropdown(true)}
          className="w-full p-3 rounded-xl border border-neon-purple/40
                     bg-neon-dark/60 text-white
                     focus:outline-none focus:ring-2
                     focus:ring-neon-purple
                     placeholder-gray-400
                     shadow-[0_0_10px_#a855f755]
                     transition-all duration-300"
        />

        <div className="absolute right-3 top-3 text-neon-glow">
          🎵
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2
                       bg-gradient-to-br from-neon-dark to-black/90
                       border border-neon-purple/40
                       rounded-xl
                       shadow-[0_0_20px_#a855f755]
                       max-h-80 overflow-y-auto z-50
                       backdrop-blur-sm"
            aria-live="polite"
          >
            {status === "loading" && (
              <p className="p-4 text-sm text-gray-300 animate-pulse">
                Searching…
              </p>
            )}

            {status === "error" && (
              <div className="p-4 text-center">
                <p className="text-sm text-red-300">
                  Couldn’t search playlists. Check that the backend is running.
                </p>
                <button
                  type="button"
                  onClick={() => loadPlaylists(mood)}
                  className="mt-3 px-4 py-1.5 rounded-lg text-sm
                             bg-neon-purple/80 hover:bg-neon-purple transition"
                >
                  Try again
                </button>
              </div>
            )}

            {status === "success" && playlists.length === 0 && (
              <p className="p-4 text-sm text-gray-300 text-center">
                No playlists found for “{mood.trim()}”. Try another mood.
              </p>
            )}

            {status === "success" &&
              playlists.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    onSelectPlaylist?.(p);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left flex items-center gap-3 p-3
                             hover:bg-neon-purple/20
                             transition-all duration-200"
                >
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-md
                               border border-neon-purple/40"
                  />

                  <div>
                    <h3 className="font-semibold text-neon-glow">
                      {p.name}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-1">
                      {p.description || "No description"}
                    </p>
                  </div>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
