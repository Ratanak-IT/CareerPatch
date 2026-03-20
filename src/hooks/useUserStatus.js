// src/hooks/useUserStatus.js
// Checks the current user's ban/suspend status from Supabase on every app load
// Returns: { status, isBanned, isSuspended, loading }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthUser, selectIsAuthed } from "../features/auth/authSlice";
import { supabase } from "../lib/supabaseClient";

export function useUserStatus() {
  const dispatch   = useDispatch();
  const isAuthed   = useSelector(selectIsAuthed);
  const authUser   = useSelector(selectAuthUser);

  const [status,  setStatus]  = useState("ACTIVE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed || !authUser) {
      setLoading(false);
      return;
    }

    const userId = String(authUser.id ?? authUser.userId ?? "");
    if (!userId) { setLoading(false); return; }

    supabase
      .from("admin_user_status")
      .select("status, reason")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        const s = String(data?.status || "ACTIVE").toUpperCase();
        setStatus(s);
        setLoading(false);
      })
      .catch(() => {
        setStatus("ACTIVE");
        setLoading(false);
      });
  }, [isAuthed, authUser]);

  const isBanned    = status === "BANNED";
  const isSuspended = status === "SUSPENDED";

  return { status, isBanned, isSuspended, loading };
}

// Standalone function — call anywhere (login check, profile load, etc.)
export async function getUserStatusById(userId) {
  if (!userId) return "ACTIVE";
  const { data } = await supabase
    .from("admin_user_status")
    .select("status")
    .eq("user_id", String(userId))
    .maybeSingle();
  return String(data?.status || "ACTIVE").toUpperCase();
}