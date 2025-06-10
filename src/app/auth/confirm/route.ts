import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = createClient();

    const { data, error } = await (
      await supabase
    ).auth.verifyOtp({
      token_hash,
      type,
    });
    console.log("verifyOtp result:", { data, error });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/auth";
  return NextResponse.redirect(redirectTo);
}
