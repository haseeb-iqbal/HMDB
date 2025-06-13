"use client";
import { supabase } from "@/lib/supabaseClient";

export default function GoogleAuthButton() {
  async function handleSignInWithGoogle(response) {
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

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id="236825369386-mkpg35emrm7cibbsnvmglg3jms7pbaca.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="redirect"
        data-callback="handleSignInWithGoogle"
        data-auto_prompt="false"
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
