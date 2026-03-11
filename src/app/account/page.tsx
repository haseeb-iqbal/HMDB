"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaEdit, FaCheck, FaCamera } from "react-icons/fa";

export default function UserAccountPage() {
  const supabase = createClient();

  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setSupabaseUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (supabaseUser) {
      const meta = (supabaseUser.user_metadata || {}) as any;
      setDisplayName(meta.display_name || "");
      setBio(meta.bio || "");
      setAvatarUrl(meta.avatar_url || "");
    }
  }, [supabaseUser]);

  const handleSaveField = async (field: "name" | "bio") => {
    if (!supabaseUser) return;
    setLoading(true);
    const updates: any = {};
    if (field === "name") updates.display_name = displayName;
    if (field === "bio") updates.bio = bio;
    const { error } = await supabase.auth.updateUser({ data: updates });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Saved." });
      if (field === "name") setEditingName(false);
      if (field === "bio") setEditingBio(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !supabaseUser) return;
    const file = e.target.files[0];
    setLoading(true);
    const filePath = `${supabaseUser.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (uploadError) {
      setMessage({ type: "error", text: uploadError.message });
      setLoading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    // update metadata
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
    setLoading(false);
    setMessage({ type: "success", text: "Avatar updated." });
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
        gap: 3,
        color: "text.primary",
      }}
    >
      <Typography variant="h4" align="center">
        My Account
      </Typography>

      <Box sx={{ position: "relative", width: 100, height: 100, mx: "auto" }}>
        {loading ? (
          <CircularProgress sx={{ position: "absolute", top: 0, left: 0 }} />
        ) : (
          <Avatar
            src={avatarUrl || undefined}
            sx={{ width: 100, height: 100 }}
          />
        )}
        <IconButton
          onClick={handleAvatarClick}
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
          size="small"
        >
          <FaCamera size={16} />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onFileChange}
          hidden
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {editingName ? (
          <>
            <TextField
              label="Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
            />
            <IconButton onClick={() => handleSaveField("name")}>
              <FaCheck />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h6">
              {displayName || "Unnamed User"}
            </Typography>
            <IconButton onClick={() => setEditingName(true)}>
              <FaEdit />
            </IconButton>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {editingBio ? (
          <>
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <IconButton onClick={() => handleSaveField("bio")}>
              <FaCheck />
            </IconButton>
          </>
        ) : (
          <>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {bio || "No bio provided."}
            </Typography>
            <IconButton onClick={() => setEditingBio(true)}>
              <FaEdit />
            </IconButton>
          </>
        )}
      </Box>

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
