"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    setError(signUpError?.message || null);
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setError(signInError?.message || null);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 rounded">
      {error && <p className="text-red-400 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
      />
      <div className="flex space-x-2">
        <button
          disabled={loading}
          onClick={handleSignUp}
          className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-500"
        >
          Sign Up
        </button>
        <button
          disabled={loading}
          onClick={handleSignIn}
          className="flex-1 bg-green-600 py-2 rounded hover:bg-green-500"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
