"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

export default function UserAccountPage() {
  const supabase = createClient();

  const [supabaseUser, setSupabaseUser] = useState<User>();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  //   const [mysession, setMySession] =
  //     useState<import("@supabase/supabase-js").UserResponse>();

  //   useEffect(() => {
  //     supabase.auth.getUser().then((session) => {
  //       // do something here with the session like  ex: setState(session)
  //       setMySession(session);
  //     });
  //   }, []);

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      if (session.data.user) {
        setSupabaseUser(session.data.user);
      }
    });
  }, []);

  useEffect(() => {
    if (supabaseUser) {
      const metadata = (supabaseUser.user_metadata || {}) as any;
      setDisplayName(metadata.display_name || "");
      setBio(metadata.bio || "");
      setAvatarUrl(metadata.avatar_url || "");
    }
  }, [supabaseUser]);

  const handleSave = async () => {
    setLoading(true);
    const updates: any = { display_name: displayName, bio };
    if (avatarUrl) {
      updates.avatar_url = avatarUrl;
    }
    const { error } = await supabase.auth.updateUser({ data: updates });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    // upload to Supabase storage bucket "avatars" with file name = user.id
    const filePath = `${supabaseUser?.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (uploadError) {
      setMessage({ type: "error", text: uploadError.message });
      setLoading(false);
      return;
    }
    // get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(publicUrl);
    setLoading(false);
  };

  if (!supabaseUser) {
    return <Typography>Please sign in to view your account.</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 8,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" align="center">
        My Account
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Avatar src={avatarUrl || undefined} sx={{ width: 80, height: 80 }} />
        )}
        <Button variant="outlined" component="label">
          Change Avatar
          <input hidden accept="image/*" type="file" onChange={onFileChange} />
        </Button>
      </Box>

      <TextField
        label="Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        fullWidth
      />

      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        multiline
        minRows={3}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={loading}
        sx={{ alignSelf: "flex-end", mt: 2 }}
      >
        Save Changes
      </Button>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        {message && (
          <Alert
            onClose={() => setMessage(null)}
            severity={message.type}
            sx={{ width: "100%" }}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
