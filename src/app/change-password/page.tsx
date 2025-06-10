"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  validatePasswordRules,
  validateConfirmPassword,
} from "@/lib/validation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";

export default function ChangePasswordForm() {
  const router = useRouter();

  const supabase = createClient();
  // const searchParams = useSearchParams();

  // Check for password recovery flow

  // const token = searchParams?.get("token");
  // const type = searchParams?.get("type");
  // const isRecovery = type === "recovery" && token;
  // New Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & global messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [mysession, setMySession] =
    useState<import("@supabase/supabase-js").UserResponse>();

  // Field‐specific errors
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  // If not in recovery flow and no session, redirect to sign-in
  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      // do something here with the session like  ex: setState(session)
      setMySession(session);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("Session:", data);

      console.log("Session data:", data, "Error:", error);
      if (error) {
        router.replace("/auth");
      }
    })();
  }, [, mysession, router]);

  const handleChangePassword = async () => {
    // Clear previous errors/messages
    setGlobalError(null);
    setMessage(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // 1) Validate password rules
    const pwErr = validatePasswordRules(password);
    if (pwErr) {
      setPasswordError(pwErr);
    }

    // 2) Validate password match
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (confirmErr) {
      setConfirmPasswordError(confirmErr);
    }

    // If any field has an error, abort
    if (pwErr || confirmErr) {
      return;
    }

    setLoading(true);

    // Regular password change for logged-in user

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setGlobalError(error.message);
    } else {
      setMessage("✅ Password updated successfully.");
      // Optionally clear the form
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/"), 1500);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      <Box
        sx={{
          p: 4,
          bgcolor: "grey.900",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" align="center" color="white" gutterBottom>
          Change Password
          {/* {isRecovery ? "Reset Password" : "Change Password"} */}
        </Typography>

        {/* New Password Field */}
        <TextField
          type="password"
          label="New Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(null);
          }}
          error={!!passwordError}
          helperText={
            passwordError ??
            "Must be ≥8 chars, include uppercase, lowercase, digit & special character."
          }
          fullWidth
          margin="normal"
          InputProps={{
            sx: {
              bgcolor: "grey.800",
              color: "white",
            },
          }}
          InputLabelProps={{
            sx: {
              color: "grey.300",
            },
          }}
        />

        {/* Confirm Password Field */}
        <TextField
          type="password"
          label="Confirm New Password"
          placeholder="Re‐type your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmPasswordError(null);
          }}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError ?? ""}
          fullWidth
          margin="normal"
          InputProps={{
            sx: {
              bgcolor: "grey.800",
              color: "white",
            },
          }}
          InputLabelProps={{
            sx: {
              color: "grey.300",
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleChangePassword}
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.5,
            textTransform: "none",
          }}
        >
          {
            loading ? "Processing…" : "Reset Password"
            // : isRecovery
            // ? "Reset Password"
            // : "Update Password"
          }
        </Button>
      </Box>

      {/* Snackbar for any additional notifications */}
      <Snackbar
        open={!!message || !!globalError}
        autoHideDuration={6000}
        onClose={() => {
          setMessage(null);
          setGlobalError(null);
        }}
      >
        {message ? (
          <Alert
            onClose={() => setMessage(null)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        ) : globalError ? (
          <Alert
            onClose={() => setGlobalError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {globalError}
          </Alert>
        ) : null}
      </Snackbar>
    </Container>
  );
}
