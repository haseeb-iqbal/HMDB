"use client";
import { supabase } from "@/lib/supabaseClient";

async function handleSignInWithGoogle(response) {
  console.log("Signing in with Google:", response);

  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
    nonce: nonce,
  });
  if (error) {
    console.error("Error signing in with Google:", error);
    return;
  }
  console.log("Successfully signed in with Google:", data);
}

export default function GoogleAuthButton() {
  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-context="signin"
        data-ux_mode="redirect"
        data-callback="handleSignInWithGoogle"
        data-auto_prompt="false"
        data-use_fedcm_for_prompt="true"
        data-login_uri="http://localhost:3000"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_blue"
        data-text="continue_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
}
