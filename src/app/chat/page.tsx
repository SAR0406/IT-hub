import { requireUser } from "@/lib/auth";
import { ChatRoom } from "./ChatRoom";

export const metadata = {
  title: "Class Chat — IT Hub 11",
};

export default async function ChatPage() {
  const ctx = await requireUser();
  if (!ctx) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs font-medium text-brand">~/it-hub-11/chat</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Class Chat
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">
        Chat with the whole class in real time — ask doubts, share answers, and
        hang out. Be kind, keep it on-topic, and remember the teacher can see
        everything.
      </p>
      <div className="mt-6">
        <ChatRoom profile={ctx.profile} />
      </div>
    </div>
  );
}