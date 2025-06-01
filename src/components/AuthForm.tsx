// src/components/AuthForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  // 1) New name field
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Field-specific error messages:
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // Client-side password validation function
  const validatePasswordRules = (pw: string): string | null => {
    if (pw.length < 8) {
      return "Must be at least 8 characters.";
    }
    if (!/[A-Z]/.test(pw)) {
      return "Must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pw)) {
      return "Must include at least one lowercase letter.";
    }
    if (!/[0-9]/.test(pw)) {
      return "Must include at least one digit.";
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw)) {
      return "Must include at least one special character.";
    }
    return null; // valid
  };

  const handleSignUp = async () => {
    // Clear previous errors:
    setGlobalError(null);
    setMessage(null);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // 1) Validate name (non-empty)
    if (!name.trim()) {
      setNameError("Please enter your full name.");
    }

    // 2) Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
    }

    // 3) Validate password rules
    const pwRuleError = validatePasswordRules(password);
    if (pwRuleError) {
      setPasswordError(pwRuleError);
    }

    // 4) Validate password match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    }

    // If any field has an error, abort signup:
    if (
      nameError ||
      !name.trim() ||
      emailError ||
      pwRuleError ||
      passwordError ||
      password !== confirmPassword ||
      confirmPasswordError
    ) {
      return;
    }

    setLoading(true);

    // 5) Proceed with Supabase sign-up, storing name as "display_name"
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: name.trim(),
        },
      },
    });

    let authError: string | null = null;

    // Supabase indicates duplicate by returning user.identities length===0
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      authError =
        "An account with that email already exists. Please sign in instead.";
    } else if (signUpError) {
      authError = signUpError.message;
    }

    if (authError) {
      setGlobalError(authError);
    } else {
      setMessage(
        "🎉 Sign-up successful! Check your email (including Spam) for a confirmation link."
      );
      // Clear fields:
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  const handleSignIn = async () => {
    setGlobalError(null);
    setMessage(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setGlobalError(signInError.message);
    } else {
      setMessage("✅ Sign-in successful! Redirecting…");
      setTimeout(() => router.push("/"), 1000);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Global messages */}
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
        Welcome
      </h2>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            placeholder="First and last name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            className={`
              w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 
              ${
                nameError
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }
            `}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-400">{nameError}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
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

        {/* Password Field */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(null);
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

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re‐type your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(null);
            }}
            className={`
              w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 
              ${
                confirmPasswordError
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }
            `}
          />
          {confirmPasswordError && (
            <p className="mt-1 text-xs text-red-400">{confirmPasswordError}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="flex-1 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 transition"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="flex-1 py-2 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
