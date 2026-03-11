// src/components/Navbar.tsx
"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Avatar from "@mui/material/Avatar";

export default function Navbar() {
  const [supabaseUser, setSupabaseUser] = useState<User>();

  const supabase = createClient();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      if (session.data.user) {
        setSupabaseUser(session.data.user);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (event === "SIGNED_IN") {
        setSupabaseUser(session?.user);
        const metadata = (session?.user.user_metadata || {}) as any;
        setAvatarUrl(metadata.avatar_url || "");

        // handle sign in even
      } else if (event === "SIGNED_OUT") {
        setSupabaseUser(undefined);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

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
          {supabaseUser ? (
            <>
              <Link
                href="/account"
                className="text-white  flex space-x-4 items-center"
              >
                <Avatar
                  src={avatarUrl || undefined}
                  sx={{ width: 20, height: 20 }}
                />
                {supabaseUser.user_metadata.display_name}
              </Link>
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
