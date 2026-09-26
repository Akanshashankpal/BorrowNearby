import { useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Send } from "lucide-react";
import type { Conversation, Message, User } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { formatWhen } from "@/utils/format";

export function ChatWindow({
  conversation,
  messages,
  me,
  peer,
  onSend,
}: {
  conversation: Conversation;
  messages: Message[];
  me: User;
  peer?: User;
  onSend: (body: string, imageUrl?: string) => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(imageUrl?: string) {
    const text = body.trim();
    if (!text && !imageUrl) return;
    setSending(true);
    await onSend(text || "Photo", imageUrl);
    setBody("");
    setSending(false);
  }

  return (
    <section className="flex min-h-[28rem] flex-col rounded-[1.75rem] border border-line bg-surface">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Photo src={peer?.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{peer?.name ?? "Conversation"}</p>
          <p className="text-xs text-muted">{conversation.peerTyping ? "Typing…" : "Messages stay on this request"}</p>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-3 overflow-auto p-4" aria-live="polite">
        {messages.map((message) => {
          const mine = message.senderId === me.id;
          return (
            <div key={message.id} className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${mine ? "ml-auto bg-brand text-white" : "bg-brand-soft text-ink"}`}>
              {message.kind === "item" && message.itemId ? (
                <Link to={`/item/${message.itemId}`} className="font-semibold underline">
                  Item preview
                </Link>
              ) : null}
              {message.kind === "request" && message.requestId ? (
                <Link to={`/requests/${message.requestId}`} className="font-semibold underline">
                  Request preview
                </Link>
              ) : null}
              {message.imageUrl ? <Photo src={message.imageUrl} alt="Shared" className="mb-2 max-h-40 rounded-2xl object-cover" /> : null}
              <p>{message.body}</p>
              <p className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-muted"}`}>
                {formatWhen(message.createdAt)} · {message.read ? "Read" : "Sent"}
              </p>
            </div>
          );
        })}
        {conversation.peerTyping ? <p className="text-xs text-muted">Typing…</p> : null}
      </div>
      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="grid h-11 w-11 cursor-pointer place-items-center rounded-full hover:bg-brand-soft">
          <ImagePlus size={18} aria-hidden />
          <span className="sr-only">Attach an image</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                void submit(String(reader.result));
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        <label className="sr-only" htmlFor="chat-body">
          Message
        </label>
        <input
          id="chat-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a message"
          className="h-11 flex-1 rounded-full border border-line bg-bg px-4 text-sm outline-none"
        />
        <button type="submit" disabled={sending} className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white" aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}
