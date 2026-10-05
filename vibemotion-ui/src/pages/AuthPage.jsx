// src/pages/AuthPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/clipShapes.css";
import WelcomeAnimation from "../components/WelcomeAnimation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then((res) => {
      if (mounted && res.data?.session?.user) {
        setUser(res.data.session.user);
      }
    });
    return () => (mounted = false);
  }, []);

  const handleResetPassword = useCallback(async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setInfo("Check your email for the reset link!");
      setForgotPassword(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [form.email]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setInfo("");

      try {
        if (forgotPassword) {
          await handleResetPassword();
          return;
        }

        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });
          if (error) throw error;

          const session = await supabase.auth.getSession();
          setUser(session.data.session.user);
        } else {
          const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { username: form.username } },
          });
          if (error) throw error;
          setInfo("Check your email to confirm registration!");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [forgotPassword, handleResetPassword, isLogin, form]
  );

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2a0a4a] to-[#100018] text-white relative">
        <h2 className="text-3xl font-bold mb-2">
          Welcome, {user.user_metadata?.username || user.email}!
        </h2>
        <p className="text-neon-purple mt-3 text-lg animate-pulse">
          Preparing your Vibemotion experience...
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 bg-neon-purple text-white px-6 py-2 rounded-lg hover:scale-105 transition"
        >
          Log out
        </button>

        <WelcomeAnimation onComplete={() => navigate("/main")} />
      </div>
    );
  }

  // Login/Register form
  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/main_background4.webp)`,
        backgroundPosition: "30% center",
        backgroundSize: "cover",
      }}
    >
      {/* Form panel */}
      <div className="absolute top-0 h-full flex flex-col items-center justify-center left-0 md:left-auto md:right-0 px-6 sm:px-12 md:px-16 lg:px-20 w-full md:w-[42%] lg:w-[40%] max-w-full transition-all duration-500 ease-in-out">
        <div className="absolute inset-0 bg-[#1b002bdd] shadow-2xl panel-clip rounded-l-[100px]" />

        <div className="absolute mt-24 top-12 w-full text-center z-10 px-2">
          <h1
            className="font-extrabold mb-3 text-neon-purple drop-shadow-[0_0_25px_#a855f7]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Vibemotion
          </h1>
          <p
            className="text-neon-purple/80 drop-shadow-[0_0_10px_#a855f7]"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
          >
            Your mood. Your playlist. Log in for the full experience.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto space-y-8 mt-48">
          <div className="w-full flex flex-col">
            {!forgotPassword && (
              <h2
                className="text-center font-semibold text-neon-purple drop-shadow-[0_0_20px_#a855f7]"
                style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
              >
                {isLogin ? "Welcome Back" : "Join to Vibemotion"}
              </h2>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-2">
              {!isLogin && !forgotPassword && (
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="p-3 rounded-lg bg-[#160022aa] text-white border border-[#a855f755] focus:outline-none"
                />
              )}
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="p-3 rounded-lg bg-[#160022aa] text-white border border-[#a855f755] focus:outline-none"
              />
              {!forgotPassword && (
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="p-3 rounded-lg bg-[#160022aa] text-white border border-[#a855f755] focus:outline-none"
                />
              )}

              {error && <div className="text-red-400 text-sm">{error}</div>}
              {info && <div className="text-green-400 text-sm">{info}</div>}

              <button
                type={forgotPassword ? "button" : "submit"}
                onClick={forgotPassword ? handleResetPassword : undefined}
                disabled={loading}
                className="mt-3 p-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-glow text-white font-semibold hover:scale-105 transition"
              >
                {loading
                  ? "Please wait..."
                  : forgotPassword
                  ? "Send new password"
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>

              {/* GOOGLE & SPOTIFY gombok */}
              {isLogin && !forgotPassword && (
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/google")
                    }
                    className="w-full p-3 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:scale-105 transition"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/g-logo.png`}
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/spotify")
                    }
                    className="w-full p-3 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 transition"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/s-logo1.png`}
                      alt="Spotify"
                      className="w-5 h-5"
                    />
                    Continue with Spotify
                  </button>
                </div>
              )}
            </form>

            {!forgotPassword && isLogin && (
              <p
                className="text-sm text-neon-glow underline mt-2 cursor-pointer text-center"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </p>
            )}

            {forgotPassword && (
              <div className="flex flex-col items-center mt-4">
                <button
                  onClick={() => setForgotPassword(false)}
                  className="text-neon-glow underline text-sm"
                >
                  Back to Login
                </button>
              </div>
            )}

            {forgotPassword && (
              <p className="text-sm text-gray-300 mt-2 text-center">
                Enter your email to reset your password.
              </p>
            )}

            {!forgotPassword && (
              <p className="text-sm sm:text-base text-gray-300 mt-6 text-center">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-neon-glow underline"
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
