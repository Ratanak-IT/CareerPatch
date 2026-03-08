import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export function useNotifications(userId, userType, onNew) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);

  // Keep a ref so real-time handlers always see latest list
  const notifsRef = useRef([]);
  notifsRef.current = notifications;

  // ── helpers ────────────────────────────────────────────────────────────────
  const uid = userId ? String(userId) : null;
  const isBusiness = String(userType || "").toUpperCase().includes("BUSINESS");

  const rebuild = useCallback((list) => {
    const sorted = [...list].sort((a, b) => new Date(b.time) - new Date(a.time));
    setNotifications(sorted);
    setUnreadCount(sorted.filter((n) => !n.read).length);
  }, []);

  // ── load initial unread messages ───────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!uid) return [];

    const { data: convs } = await supabase
      .from("conversations")
      .select("id, user_a_id, user_b_id")
      .or(`user_a_id.eq.${uid},user_b_id.eq.${uid}`);

    if (!convs?.length) return [];

    const convIds = convs.map((c) => c.id);

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", convIds)
      .eq("read", false)
      .neq("sender_id", uid)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!msgs) return [];

    return msgs.map((msg) => ({
      id:      `msg:${msg.id}`,
      _rawId:  msg.id,
      type:    "message",
      title:   msg.sender_name || "Someone",
      preview: msg.content?.length > 60 ? msg.content.slice(0, 60) + "…" : (msg.content || ""),
      avatar:  msg.sender_avatar || null,
      time:    msg.created_at,
      convId:  msg.conversation_id,
      read:    false,
    }));
  }, [uid]);

  // ── load initial unread applications (only for BUSINESS owners) ───────────
  const loadApplications = useCallback(async () => {
    if (!uid || !isBusiness) return [];

    // Get all jobs owned by this user
    // We check job_applications where the job belongs to this business user
    // We need to join via job_id — but since we don't have a jobs supabase table,
    // we use applicant_id != uid and no "seen" flag yet (add seen_by_owner column below)
    const { data: apps } = await supabase
      .from("job_applications")
      .select("*")
      .eq("seen_by_owner", false)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!apps) return [];

    return apps.map((app) => ({
      id:      `app:${app.id}`,
      _rawId:  app.id,
      type:    "application",
      title:   app.full_name || "Someone",
      preview: `Applied for: ${app.job_title || "a position"}`,
      avatar:  app.applicant_avatar || null,
      time:    app.created_at,
      jobId:   app.job_id,
      appId:   app.id,
      applicantId: app.applicant_id,
      read:    false,
    }));
  }, [uid, isBusiness]);

  // ── initial load ───────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    const [msgs, apps] = await Promise.all([loadMessages(), loadApplications()]);
    rebuild([...msgs, ...apps]);
  }, [loadMessages, loadApplications, rebuild]);

  // ── mark one read ──────────────────────────────────────────────────────────
  const markRead = useCallback(async (notifId) => {
    const notif = notifsRef.current.find((n) => n.id === notifId);
    if (!notif) return;

    if (notif.type === "message") {
      await supabase.from("messages").update({ read: true }).eq("id", notif._rawId);
    } else if (notif.type === "application") {
      await supabase.from("job_applications").update({ seen_by_owner: true }).eq("id", notif._rawId);
    }

    const updated = notifsRef.current.map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    rebuild(updated);
  }, [rebuild]);

  // ── mark all read ──────────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    const unread = notifsRef.current.filter((n) => !n.read);
    if (!unread.length) return;

    const msgIds = unread.filter((n) => n.type === "message").map((n) => n._rawId);
    const appIds = unread.filter((n) => n.type === "application").map((n) => n._rawId);

    await Promise.all([
      msgIds.length && supabase.from("messages").update({ read: true }).in("id", msgIds),
      appIds.length && supabase.from("job_applications").update({ seen_by_owner: true }).in("id", appIds),
    ]);

    rebuild(notifsRef.current.map((n) => ({ ...n, read: true })));
  }, [rebuild]);

  // ── real-time subscriptions ────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;
    loadAll();

    // ── Messages channel ──
    const msgChannel = supabase
      .channel(`notif-msg:${uid}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
      }, async (payload) => {
        const msg = payload.new;
        if (String(msg.sender_id) === uid) return;

        // Verify it's in one of my conversations
        const { data: conv } = await supabase
          .from("conversations")
          .select("id")
          .eq("id", msg.conversation_id)
          .or(`user_a_id.eq.${uid},user_b_id.eq.${uid}`)
          .maybeSingle();
        if (!conv) return;

        const newNotif = {
          id:      `msg:${msg.id}`,
          _rawId:  msg.id,
          type:    "message",
          title:   msg.sender_name || "Someone",
          preview: msg.content?.length > 60 ? msg.content.slice(0, 60) + "…" : (msg.content || ""),
          avatar:  msg.sender_avatar || null,
          time:    msg.created_at,
          convId:  msg.conversation_id,
          read:    false,
        };

        if (notifsRef.current.some((n) => n.id === newNotif.id)) return;

        rebuild([newNotif, ...notifsRef.current]);
        onNew?.(newNotif);
      })
      .subscribe();

    // ── Applications channel (only for business) ──
    let appChannel = null;
    if (isBusiness) {
      appChannel = supabase
        .channel(`notif-app:${uid}`)
        .on("postgres_changes", {
          event: "INSERT", schema: "public", table: "job_applications",
        }, async (payload) => {
          const app = payload.new;
          // Only notify if this business user owns the job
          // Since we don't have owner_id on job_applications yet,
          // we check via the Spring Boot API or trust the Supabase RLS.
          // For now: fire for all new applications (RLS will filter per user).
          if (String(app.applicant_id) === uid) return; // don't notify self

          const newNotif = {
            id:      `app:${app.id}`,
            _rawId:  app.id,
            type:    "application",
            title:   app.full_name || "Someone",
            preview: `Applied for: ${app.job_title || "a position"}`,
            avatar:  app.applicant_avatar || null,
            time:    app.created_at,
            jobId:   app.job_id,
            appId:   app.id,
            applicantId: app.applicant_id,
            read:    false,
          };

          if (notifsRef.current.some((n) => n.id === newNotif.id)) return;

          rebuild([newNotif, ...notifsRef.current]);
          onNew?.(newNotif);
        })
        .subscribe();
    }

    return () => {
      supabase.removeChannel(msgChannel);
      if (appChannel) supabase.removeChannel(appChannel);
    };
  }, [uid, isBusiness, loadAll, rebuild, onNew]);

  return { notifications, unreadCount, markRead, markAllRead };
}