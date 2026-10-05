// src/pages/MainPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlaylists } from "../api";
import SideBar from "../components/SideBar";
import MoodCards from "../components/MoodCards";
import SearchBar from "../components/SearchBar";
import CategoryBar from "../components/CategoryBar";
import PlaylistPlayer from "../components/PlaylistPlayer";
import { supabase } from "../supabaseClient";

// A Spotify leírások HTML-t és entitásokat tartalmazhatnak (<a>, &#x27; ...)
const plainText = (html = "") =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";

export default function MainPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [username, setUsername] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const resultsRef = useRef(null);
  const requestIdRef = useRef(0); // elavult válaszok eldobására
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) {
        navigate("/auth");
      } else {
        setUsername(data.session.user.user_metadata?.username || data.session.user.email);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleMoodSelect = useCallback(async (moodName) => {
    const requestId = ++requestIdRef.current;
    setSelectedMood(moodName);
    setStatus("loading");
    setPlaylists([]);

    // Görgetés a találatokhoz (a fix fejléc miatt scroll-mt a konténeren)
    setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );

    try {
      const items = await fetchPlaylists(moodName);
      if (requestId !== requestIdRef.current) return; // közben másik hangulatot választott
      setPlaylists(items);
      setStatus("success");
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Spotify playlists fetch error:", error);
      setStatus("error");
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col relative">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#1a002e] to-[#3b0066] z-0"
        style={{ backgroundAttachment: "fixed" }}
      />

      <div className="w-full flex justify-between items-center p-6 fixed top-0 left-0 z-50
                      bg-black/70 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            className="text-white text-2xl md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            &#9776;
          </button>
          <h1 className="text-3xl font-bold text-neon-glow drop-shadow-[0_0_10px_#a855f7]">
            Vibemotion
          </h1>
        </div>

        {username && (
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">{username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-neon-purple/80 hover:bg-neon-purple rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="flex pt-24 relative z-10">
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div
          className={`flex-1 md:ml-60 px-4 sm:px-8 ${
            selectedPlaylist ? "pb-[26rem]" : ""
          }`}
        >
          <SearchBar onSelectPlaylist={setSelectedPlaylist} />

          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <MoodCards
            selectedCategory={selectedCategory}
            selectedMood={selectedMood}
            onSelectMood={handleMoodSelect}
          />

          {/* ===== Találatok ===== */}
          {status !== "idle" && (
            <section
              ref={resultsRef}
              className="scroll-mt-28 mt-12 w-full max-w-5xl mx-auto px-2 sm:px-8"
              aria-live="polite"
            >
              <h2 className="text-2xl font-bold text-neon-glow drop-shadow-[0_0_10px_#a855f7]">
                Playlists for “{selectedMood}”
              </h2>

              {status === "loading" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse border border-neon-purple/30 rounded-xl bg-[#1a002e]/60"
                    >
                      <div className="w-full aspect-[4/3] bg-neon-purple/20 rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 w-3/4 bg-neon-purple/20 rounded" />
                        <div className="h-4 w-full bg-neon-purple/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {status === "error" && (
                <div className="mt-6 p-6 rounded-xl border border-red-400/40 bg-red-950/30 text-center">
                  <p className="text-red-300">
                    Couldn’t load playlists. Check your connection and that the backend is running.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleMoodSelect(selectedMood)}
                    className="mt-4 px-5 py-2 rounded-lg bg-neon-purple/80 hover:bg-neon-purple transition"
                  >
                    Try again
                  </button>
                </div>
              )}

              {status === "success" && playlists.length === 0 && (
                <div className="mt-6 p-6 rounded-xl border border-neon-purple/40 bg-[#1a002e]/60 text-center text-gray-300">
                  No playlists found for this mood. Try another one or use the search bar.
                </div>
              )}

              {status === "success" && playlists.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                  {playlists.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedPlaylist(p)}
                      className={`text-left border rounded-xl shadow-[0_0_15px_#a855f750] hover:shadow-[0_0_25px_#a855f7] transition-transform bg-[#1a002e]/60 backdrop-blur-sm hover:scale-105 ${
                        selectedPlaylist?.id === p.id
                          ? "border-neon-glow ring-2 ring-neon-glow"
                          : "border-neon-purple/40"
                      }`}
                    >
                      <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl bg-neon-purple/10">
                        {p.images?.[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-neon-glow line-clamp-2">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {plainText(p.description) || "No description"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <PlaylistPlayer
        playlist={selectedPlaylist}
        onClose={() => setSelectedPlaylist(null)}
      />
    </div>
  );
}
