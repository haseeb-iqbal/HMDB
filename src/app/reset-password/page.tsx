// src/app/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ResetPasswordPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // “access_token” comes from Supabase’s recovery link
  const [token, setToken] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Field-specific errors
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // 1) On mount, grab “access_token” from URL and call getSessionFromUrl()
  useEffect(() => {
    if (searchParams == null) {
      console.log("No searchParams found");
      return;
    }
    console.log("searchParams:", searchParams.toString());
    const t = searchParams.get("token_hash");
    if (!t) {
      setSessionError("No recovery token found in URL.");
      setSessionLoading(false);
      return;
    }
    setToken(t);

    // This will exchange the access_token for a valid session and store it.
    supabase.auth
      .getSessionFromUrl({ storeSession: true })
      .then(({ data, error }) => {
        if (error) {
          console.error("getSessionFromUrl error:", error.message);
          setSessionError("Invalid or expired reset link.");
        }
        // If successful, Supabase client now has a session; we can show the form.
        setSessionLoading(false);
      })
      .catch((err) => {
        console.error("Unexpected error fetching session:", err);
        setSessionError("Unexpected error while validating reset link.");
        setSessionLoading(false);
      });
  }, [searchParams, supabase]);

  // 2) Simple password rules (≥8 chars, uppercase, lowercase, digit, special)
  const validatePasswordRules = (pw: string): string | null => {
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pw)) return "Must include at least one uppercase letter.";
    if (!/[a-z]/.test(pw)) return "Must include at least one lowercase letter.";
    if (!/[0-9]/.test(pw)) return "Must include at least one digit.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw))
      return "Must include at least one special character.";
    return null;
  };

  // 3) Handle submission of new password
  const handleUpdatePassword = async () => {
    // Clear previous errors
    setPasswordError(null);
    setConfirmError(null);
    setGlobalError(null);
    setSuccessMessage(null);

    // Validate client‐side
    const pwErr = validatePasswordRules(password);
    if (pwErr) {
      setPasswordError(pwErr);
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
    }

    if (pwErr || password !== confirmPassword) {
      return;
    }

    setUpdating(true);

    // The Supabase client already has a session (from getSessionFromUrl).
    // Now call updateUser to set the new password.
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Error updating password:", error.message);
      setGlobalError(error.message);
    } else {
      setSuccessMessage(
        "✅ Your password has been updated. Redirecting to Sign In…"
      );
      // Wait a moment, then redirect to /auth (or whatever your sign-in page is)
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    }

    setUpdating(false);
  };

  // 4) Render logic
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Validating reset link…</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-red-400 text-center mb-4">{sessionError}</p>
          <button
            onClick={() => router.push("/auth")}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // 5) Show “New Password” form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        {successMessage ? (
          <p className="text-green-400 text-center">{successMessage}</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">
              Choose a New Password
            </h2>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">
                New Password
              </label>
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
              <p className="text-xs text-gray-400 mt-1">
                Must be ≥8 chars, include uppercase, lowercase, digit & special
                character.
              </p>
              {passwordError && (
                <p className="mt-1 text-xs text-red-400">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-type your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError(null);
                  setGlobalError(null);
                }}
                className={`
                  w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 
                  ${
                    confirmError
                      ? "border border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }
                `}
              />
              {confirmError && (
                <p className="mt-1 text-xs text-red-400">{confirmError}</p>
              )}
            </div>

            {globalError && (
              <p className="mb-4 text-center text-red-400">{globalError}</p>
            )}

            <button
              onClick={handleUpdatePassword}
              disabled={updating}
              className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 transition text-white"
            >
              {updating ? "Updating…" : "Set New Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
