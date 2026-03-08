import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * useMessageNotifications
 * Watches all conversations the current user is in.
 * Returns unread message notifications in real-time.
 *
 * @param {string} userId — current user's id
 */
export function useMessageNotifications(userId) {
  const [notifications, setNotifications] = useState([]); // { id, convId, senderName, senderAvatar, preview, time, read }
  const [unreadCount,   setUnreadCount]   = useState(0);

  const loadUnread = useCallback(async () => {
    if (!userId) return;

    // Get all conversations this user is in
    const { data: convs } = await supabase
      .from("conversations")
      .select("id, user_a_id, user_b_id, user_a_name, user_b_name, user_a_avatar, user_b_avatar")
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

    if (!convs?.length) return;

    const convIds = convs.map((c) => c.id);

    // Get latest unread messages in those conversations not sent by me
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", convIds)
      .eq("read", false)
      .neq("sender_id", String(userId))
      .order("created_at", { ascending: false })
      .limit(20);

    if (!msgs) return;

    // Map messages to notification objects
    const notifs = msgs.map((msg) => {
      const conv = convs.find((c) => c.id === msg.conversation_id);
      return {
        id:           msg.id,
        convId:       msg.conversation_id,
        senderName:   msg.sender_name,
        senderAvatar: msg.sender_avatar,
        preview:      msg.content.length > 60 ? msg.content.slice(0, 60) + "…" : msg.content,
        time:         msg.created_at,
        read:         false,
      };
    });

    setNotifications(notifs);
    setUnreadCount(notifs.length);
  }, [userId]);

  // Mark a single notification as read in DB + state
  const markRead = useCallback(async (msgId) => {
    await supabase.from("messages").update({ read: true }).eq("id", msgId);
    setNotifications((prev) => prev.filter((n) => n.id !== msgId));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  // Mark all as read
  const markAllRead = useCallback(async () => {
    if (!userId) return;
    const ids = notifications.map((n) => n.id);
    if (!ids.length) return;
    await supabase.from("messages").update({ read: true }).in("id", ids);
    setNotifications([]);
    setUnreadCount(0);
  }, [notifications, userId]);

  useEffect(() => {
    if (!userId) return;
    loadUnread();

    // Subscribe to new messages globally — filter client-side
    const channel = supabase
      .channel(`msg-notif:${userId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
      }, async (payload) => {
        const msg = payload.new;
        // Ignore my own messages
        if (String(msg.sender_id) === String(userId)) return;

        // Check if this message is in one of my conversations
        const { data: conv } = await supabase
          .from("conversations")
          .select("id")
          .eq("id", msg.conversation_id)
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
          .maybeSingle();

        if (!conv) return;

        const newNotif = {
          id:           msg.id,
          convId:       msg.conversation_id,
          senderName:   msg.sender_name,
          senderAvatar: msg.sender_avatar,
          preview:      msg.content.length > 60 ? msg.content.slice(0, 60) + "…" : msg.content,
          time:         msg.created_at,
          read:         false,
        };

        setNotifications((prev) => {
          if (prev.some((n) => n.id === msg.id)) return prev;
          return [newNotif, ...prev];
        });
        setUnreadCount((c) => c + 1);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, loadUnread]);

  return { notifications, unreadCount, markRead, markAllRead };
}