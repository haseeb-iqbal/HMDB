// src/components/SignInForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/validation";
import OneTapComponent from "./OneTapComponent";
import GoogleAuthButton from "./GoogleSignInButton";

export default function SignInForm() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  // View mode: "signin" or "reset"
  const [mode, setMode] = useState<"signin" | "reset">("signin");

  // Shared fields
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign‐in–specific
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Reset‐password–specific
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    // Clear previous
    setGlobalError(null);
    setMessage(null);
    setEmailError(null);
    setPasswordError(null);

    // 1) Validate email
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
    }

    // 2) Validate password non‐empty
    if (!password) {
      setPasswordError("Please enter your password.");
    }

    if (emailErr || !password) {
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setGlobalError(signInError.message);
    } else {
      setMessage("✅ Sign-in successful! Redirecting…");
      setTimeout(() => router.push("/"), 800);
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    // Clear previous reset‐flow messages/errors
    setResetError(null);
    setResetMessage(null);

    // Validate email
    const emailErr = validateEmail(email);
    if (emailErr) {
      setResetError(emailErr);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      setResetError(error.message);
    } else {
      setResetMessage(
        "📧 If that email is registered, check your inbox (or Spam) for a reset link."
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
      {mode === "signin" ? (
        <>
          {message && (
            <div className="mb-4 p-3 bg-green-700 text-green-100 rounded">
              {message}
            </div>
          )}
          {globalError && (
            <div className="mb-4 p-3 bg-red-700 text-red-100 rounded">
              {globalError}
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4 text-white text-center">
            Sign In
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
                setGlobalError(null);
              }}
              className={`
                w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 
                ${
                  emailError
                    ? "border border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }
              `}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-400">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
                setGlobalError(null);
              }}
              className={`
                w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 
                ${
                  passwordError
                    ? "border border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }
              `}
            />
            {passwordError && (
              <p className="mt-1 text-xs text-red-400">{passwordError}</p>
            )}
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-2 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50 transition"
          >
            Sign In
          </button>

          {/* Forgot Password Link */}
          <p className="mt-4 text-center text-sm text-gray-400">
            <button
              onClick={() => {
                // Reset any sign‐in form errors, switch mode
                setEmailError(null);
                setPasswordError(null);
                setGlobalError(null);
                setMessage(null);
                setMode("reset");
              }}
              className="text-blue-400 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        </>
      ) : (
        /* ===== Reset Password Mode ===== */
        <>
          {resetMessage && (
            <div className="mb-4 p-3 bg-green-700 text-green-100 rounded">
              {resetMessage}
            </div>
          )}
          {resetError && (
            <div className="mb-4 p-3 bg-red-700 text-red-100 rounded">
              {resetError}
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4 text-white text-center">
            Reset Password
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setResetError(null);
                setResetMessage(null);
              }}
              className={`
                w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 
                ${
                  resetError
                    ? "border border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }
              `}
            />
            {resetError && (
              <p className="mt-1 text-xs text-red-400">{resetError}</p>
            )}
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 transition"
          >
            Send Reset Link
          </button>

          {/* Back to Sign In */}
          <p className="mt-4 text-center text-sm text-gray-400">
            <button
              onClick={() => {
                // Clear reset‐flow messages, switch back
                setResetError(null);
                setResetMessage(null);
                setMode("signin");
              }}
              className="text-blue-400 hover:underline"
            >
              Back to Sign In
            </button>
          </p>
        </>
      )}
      <OneTapComponent />
      <GoogleAuthButton />
    </div>
  );
}
