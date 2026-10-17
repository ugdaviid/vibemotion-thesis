import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      // A Supabase a hibát az URL query-jében vagy a hash-ben küldi vissza
      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const authError =
        query.get("error_description") || hash.get("error_description");

      if (authError) {
        console.error("OAuth error:", authError);
        setErrorMessage(authError);
        return;
      }

      const { data } = await supabase.auth.getSession();
      navigate(data?.session?.user ? "/main" : "/auth");
    };
    handleCallback();
  }, [navigate]);

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <p className="text-red-400 mb-4">Login failed: {errorMessage}</p>
        <button
          onClick={() => navigate("/auth")}
          className="px-5 py-2 rounded-lg bg-neon-purple/80 hover:bg-neon-purple transition"
        >
          Back to login
        </button>
      </div>
    );
  }

  return <div className="text-white p-10">Loading...</div>;
}