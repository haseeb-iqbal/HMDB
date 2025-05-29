// src/app/auth/page.tsx
"use client";

import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <AuthForm />
    </div>
  );
}
