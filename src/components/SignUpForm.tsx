"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  validateName,
  validateEmail,
  validatePasswordRules,
  validateConfirmPassword,
} from "@/lib/validation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export default function SignUpForm() {
  const supabase = createClient();
  const router = useRouter();

  // 1) Name field
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Field‐specific errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [supabaseUser, setSupabaseUser] = useState<User>();

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      if (session.data.user) {
        setSupabaseUser(session.data.user);
      }
    });
  }, []);

  // Redirect if already signed in
  useEffect(() => {
    if (supabaseUser) {
      router.push("/");
    }
  }, [supabaseUser, router]);

  const handleSignUp = async () => {
    // Clear previous errors/messages
    setGlobalError(null);
    setMessage(null);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // 1) Validate name
    const nameErr = validateName(trimmedName);
    if (nameErr) {
      setNameError(nameErr);
    }

    // 2) Validate email format
    const emailErr = validateEmail(trimmedEmail);
    if (emailErr) {
      setEmailError(emailErr);
    }

    // 3) Validate password rules
    const pwErr = validatePasswordRules(password);
    if (pwErr) {
      setPasswordError(pwErr);
    }

    // 4) Validate password match
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (confirmErr) {
      setConfirmPasswordError(confirmErr);
    }

    // If any field has an error, abort
    if (nameErr || emailErr || pwErr || confirmErr) {
      return;
    }

    setLoading(true);

    // 5) Proceed with Supabase sign-up, storing name as "display_name"
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          display_name: trimmedName,
        },
      },
    });

    let authError: string | null = null;

    // Supabase v2 indicates duplicate by user.identities length===0
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
      // Reset fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
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
        Sign Up
      </h2>

      {/* Name Field */}
      <div className="mb-4">
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
        {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
      </div>

      {/* Email Field */}
      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
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

      <button
        onClick={handleSignUp}
        disabled={loading}
        className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 transition"
      >
        Sign Up
      </button>
    </div>
  );
}
