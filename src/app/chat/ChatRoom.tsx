"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AI_BOT_ID,
  AI_ROOM,
  CHAT_ROOMS,
  formatChatTime,
  initials,
  type ChatMessage,
} from "@/lib/chat";
import type { Profile } from "@/lib/types";

const PAGE_SIZE = 50;
const MAX_LENGTH = 500;
const ROOMS = [...CHAT_ROOMS, AI_ROOM];

const LINK_RE = /(https?:\/\/[^\s<>"]+|(?<!\/)\/api\/[^\s<>"]+)/g;

function renderContent(content: string) {
  const parts = content.split(LINK_RE);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const external = part.startsWith("http");
      return (
        <a
          key={index}
          href={part}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

type ChatRoomProps = {
  profile: Profile;
};

export function ChatRoom({ profile }: ChatRoomProps) {
  const supabase = useMemo(() => createClient(), []);
  const [room, setRoom] = useState<string>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const isAdmin = profile.role === "admin";
  const isAiRoom = room === AI_ROOM.slug;

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("chat_messages")
        .select("id, room, user_id, sender_name, content, created_at")
        .eq("room", room)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);
      if (!active) return;
      setMessages((data ?? []).reverse() as ChatMessage[]);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel(`chat-${room}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room=eq.${room}` },
        (payload) => {
          const message = payload.new as unknown as ChatMessage;
          setMessages((current) =>
            current.some((m) => m.id === message.id) ? current : [...current, message]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages", filter: `room=eq.${room}` },
        (payload) => {
          const old = payload.old as unknown as ChatMessage;
          setMessages((current) => current.filter((m) => m.id !== old.id));
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, room]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [room, messages.length]);

  const activeRoomLabel = useMemo(
    () => ROOMS.find((r) => r.slug === room)?.label ?? "General",
    [room]
  );

  function selectRoom(nextRoom: string) {
    if (nextRoom === room) return;
    setRoom(nextRoom);
    setMessages([]);
    setLoading(true);
    setError(null);
  }

  const send = useCallback(async () => {
    const content = input.trim();
    if (!content || sending || thinking) return;
    setSending(true);
    setError(null);
    try {
      const endpoint = isAiRoom ? "/api/ai/chat" : "/api/chat";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, content }),
      });
      const data = (await response.json()) as { message?: ChatMessage; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Your message couldn't be sent.");
      }
      if (data.message) {
        setMessages((current) =>
          current.some((m) => m.id === data.message!.id) ? current : [...current, data.message!]
        );
      }
      setInput("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
      setThinking(false);
    }
  }, [input, sending, thinking, isAiRoom, room]);

  async function removeMessage(id: number) {
    setMessages((current) => current.filter((m) => m.id !== id));
    try {
      const response = await fetch(`/api/chat/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Message couldn't be removed.");
      }
    } catch {
      setError("Message couldn't be removed — try again.");
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft">
      {/* Room tabs */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-zinc-200 bg-paper px-3 py-2.5">
        {ROOMS.map((r) => (
          <button
            key={r.slug}
            type="button"
            onClick={() => selectRoom(r.slug)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              r.slug === room
                ? "bg-brand text-white"
                : "border border-zinc-200 bg-white text-mist hover:border-brand/40 hover:text-brand"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="h-[62vh] space-y-4 overflow-y-auto bg-paper px-4 py-5 sm:px-5"
        aria-live="polite"
      >
        {loading ? (
          <p className="py-8 text-center font-mono text-xs text-slate-400">
            loading messages…
          </p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="font-display text-base font-bold text-ink">
              {isAiRoom ? "Ask me anything about the syllabus" : `No messages in ${activeRoomLabel} yet`}
            </p>
            <p className="text-sm text-mist">
              {isAiRoom
                ? "Questions, doubts, file hunting — I'll answer with the archive at hand."
                : "Be the first to say hi — or ask a doubt."}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const own = message.user_id === profile.id;
            const bot = message.user_id === AI_BOT_ID;
            return (
              <div key={message.id} className={`flex items-start gap-2.5 ${own ? "flex-row-reverse" : ""}`}>
                {!own && (
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                      bot ? "bg-zinc-800 text-white" : "bg-brand-soft text-brand-strong"
                    }`}
                  >
                    {bot ? "AI" : initials(message.sender_name)}
                  </span>
                )}
                <div className={`max-w-[78%] ${own ? "text-right" : ""}`}>
                  <p className={`mb-1 flex items-baseline gap-2 font-mono text-[10px] text-slate-400 ${own ? "justify-end" : ""}`}>
                    {own ? (
                      <span className="font-semibold text-brand-strong">you</span>
                    ) : (
                      <span className="font-semibold text-ink">{message.sender_name}</span>
                    )}
                    <span>{formatChatTime(message.created_at)}</span>
                  </p>
                  <div
                    className={`inline-block whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed ${
                      own
                        ? "rounded-br-md bg-brand text-white"
                        : "rounded-bl-md border border-zinc-200 bg-white text-ink"
                    }`}
                  >
                    {renderContent(message.content)}
                  </div>
                  {isAdmin && message.user_id !== profile.id && (
                    <button
                      type="button"
                      onClick={() => removeMessage(message.id)}
                      className="mt-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete message from ${message.sender_name}`}
                    >
                      delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        {isAiRoom && thinking && (
          <div className="flex items-start gap-2.5">
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-zinc-800 font-mono text-[11px] font-bold text-white"
            >
              AI
            </span>
            <div className="rounded-bl-md rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-mist">
              <span className="animate-pulse">AI is thinking…</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-zinc-200 bg-white p-3 sm:p-4">
        {error && (
          <p role="alert" className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={MAX_LENGTH}
            placeholder={isAiRoom ? "Ask the AI assistant…" : `Message ${activeRoomLabel}…`}
            autoComplete="off"
            className="h-11 flex-1 rounded-xl border border-zinc-300 bg-paper px-4 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {sending ? (isAiRoom ? "Thinking…" : "Sending…") : "Send"}
          </button>
        </form>
        <p className="mt-1.5 font-mono text-[10px] text-slate-400">
          {input.length}/{MAX_LENGTH} ·{" "}
          {isAiRoom ? "the AI can find files from the archive for you" : "be kind, stay on-topic"}
        </p>
      </div>
    </section>
  );
}