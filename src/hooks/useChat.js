import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * useConversations — loads all conversations for the current user
 */
export function useConversations(userId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (!error) setConversations(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetch();

    if (!userId) return;
    const channel = supabase
      .channel(`conversations:${userId}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "conversations",
      }, () => fetch())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, fetch]);

  return { conversations, loading, refetch: fetch };
}

/**
 * useMessages — loads + real-time subscribes to messages in a conversation
 */
export function useMessages(conversationId) {
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const channelRef                = useRef(null);

  const fetch = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data ?? []);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    fetch();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    channelRef.current = channel;
    return () => supabase.removeChannel(channel);
  }, [conversationId, fetch]);

  const sendMessage = useCallback(async (content, sender) => {
    if (!content?.trim() || !conversationId) return;
    setSending(true);

    const msg = {
      conversation_id: conversationId,
      sender_id:       sender.id,
      sender_name:     sender.fullName || sender.username || "User",
      sender_avatar:   sender.profileImageUrl || null,
      content:         content.trim(),
    };

    const { error } = await supabase.from("messages").insert(msg);

    if (!error) {
      // update last_message on conversation
      await supabase
        .from("conversations")
        .update({ last_message: content.trim(), last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    setSending(false);
  }, [conversationId]);

  return { messages, loading, sending, sendMessage };
}

/**
 * getOrCreateConversation — called when clicking "Message" on a profile/card
 * Returns the conversation id.
 */
export async function getOrCreateConversation(myUser, otherUser) {
  const myId    = String(myUser.id || myUser.userId);
  const otherId = String(otherUser.id || otherUser.userId);

  // sort ids so (A,B) and (B,A) map to same row
  const [aId, bId] = myId < otherId ? [myId, otherId] : [otherId, myId];
  const aUser      = myId < otherId ? myUser  : otherUser;
  const bUser      = myId < otherId ? otherUser : myUser;

  // check existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a_id", aId)
    .eq("user_b_id", bId)
    .maybeSingle();

  if (existing) return existing.id;

  // create new
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      user_a_id:    aId,
      user_b_id:    bId,
      user_a_name:  aUser.fullName || aUser.username || "User",
      user_b_name:  bUser.fullName || bUser.username || "User",
      user_a_avatar: aUser.profileImageUrl || null,
      user_b_avatar: bUser.profileImageUrl || null,
    })
    .select("id")
    .single();

  if (error) { console.error("getOrCreateConversation:", error); return null; }
  return created.id;
}