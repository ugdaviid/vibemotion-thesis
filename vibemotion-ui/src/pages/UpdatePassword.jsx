import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  // A Supabase a jelszó-visszaállító linkből (URL hash) maga hoz létre egy
  // recovery sessiont, és PASSWORD_RECOVERY eseményt küld. Ezt figyeljük,
  // illetve ellenőrizzük, hogy van-e már érvényes session.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecked(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
      setChecked(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setInfo("Password updated successfully! Redirecting to login...");
      await supabase.auth.signOut();
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2a0a4a] to-[#100018] text-white px-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Set a New Password</h2>

      {checked && !ready && (
        <p className="text-red-400 mb-4 text-center">
          Invalid or expired password reset link.
        </p>
      )}
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      {ready && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm bg-[#1b002b] p-6 rounded-xl shadow-lg"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-[#160022aa] text-white border border-[#a855f755] focus:outline-none"
            minLength={6}
            required
          />
          {info && <p className="text-green-400 text-center">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-neon-purple rounded-xl hover:scale-105 transition text-white font-semibold"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}
