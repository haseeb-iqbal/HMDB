// src/components/Navbar.tsx
"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <AppBar position="static">
      <Toolbar className="bg-[#121212] shadow-md">
        <Link href="/" className="-my-7">
          <Image
            src="/HMDB_logo.webp"
            alt="HMDB logo"
            width={130}
            height={130}
            priority
          />
        </Link>
        <SearchBar />
        <div className="ml-auto flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-white">Hi, {session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-500 hover:underline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="text-sm text-blue-400 hover:underline"
            >
              Sign In / Up
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
