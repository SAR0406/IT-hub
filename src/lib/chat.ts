import { UNITS } from "@/lib/syllabus";

/**
 * Chat room identifiers. "general" is the class-wide room; every unit gets
 * its own study room. Kept in sync with /api/chat.
 */
export const CHAT_ROOMS = [
  { slug: "general", label: "General" },
  ...UNITS.map((unit) => ({ slug: unit.slug, label: unit.name })),
] as const;

export type ChatRoomSlug = (typeof CHAT_ROOMS)[number]["slug"];

export type ChatMessage = {
  id: number;
  room: string;
  user_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

export function formatChatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return time;
  const day = date.toLocaleDateString([], { day: "numeric", month: "short" });
  return `${day}, ${time}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}