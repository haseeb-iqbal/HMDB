"use client";

import { useState } from "react";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-lg">
        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-t-lg overflow-hidden">
          <button
            onClick={() => setMode("signin")}
            className={`
              flex-1 py-2 text-center text-white font-medium ${
                mode === "signin"
                  ? "bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }
            `}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`
              flex-1 py-2 text-center text-white font-medium ${
                mode === "signup"
                  ? "bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }
            `}
          >
            Sign Up
          </button>
        </div>

        {/* Panel */}
        <div className="bg-gray-800 rounded-b-lg p-4">
          {mode === "signin" ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
}
