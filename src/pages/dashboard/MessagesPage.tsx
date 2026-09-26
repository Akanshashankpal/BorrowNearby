import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { PageMeta } from "@/components/layout/PageMeta";
import { Photo } from "@/components/ui/Photo";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getConversations, getMessages, sendMessage } from "@/services/api/chat";
import { userById } from "@/services/mock/db";
import { useAuth } from "@/store/AuthProvider";
import { formatWhen } from "@/utils/format";
import { portalBase } from "@/utils/roles";

export default function MessagesPage() {
  const { conversationId } = useParams();
  const { pathname } = useLocation();
  const base = portalBase(pathname);
  const navigate = useNavigate();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { user } = useAuth();
  const conversations = useAsync(() => getConversations(), []);
  const active = conversations.data?.find((entry) => entry.id === conversationId) ?? (desktop ? conversations.data?.[0] : undefined);
  const activeId = conversationId ?? active?.id;
  const thread = useAsync(async () => (activeId ? getMessages(activeId) : []), [activeId]);
  const peerId = active?.participantIds.find((id) => id !== user?.id);
  const peer = peerId ? userById(peerId) : undefined;

  return (
    <>
      <PageMeta title="Messages" description="Conversations with owners and borrowers." path={`${base}/messages`} />
      <h1 className="text-3xl font-semibold">Messages</h1>
      {conversations.status === "error" ? <ErrorState body={conversations.error} onRetry={conversations.reload} /> : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        {(desktop || !conversationId) ? (
          <div className="grid gap-2">
            {conversations.status === "loading" ? <SkeletonTable /> : null}
            {conversations.data?.map((conversation) => {
              const other = userById(conversation.participantIds.find((id) => id !== user?.id) ?? "");
              return (
                <Link key={conversation.id} to={`${base}/messages/${conversation.id}`} className={`rounded-3xl border px-3 py-3 ${active?.id === conversation.id ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}>
                  <span className="flex items-center gap-2">
                    <Photo src={other?.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <span>
                      <span className="block font-semibold">{other?.name}</span>
                      <span className="block text-xs text-muted">{formatWhen(conversation.updatedAt)}</span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}
        {(desktop || conversationId) && active && user ? (
          <div>
            {!desktop ? <button type="button" className="mb-3 text-sm font-semibold" onClick={() => navigate(`${base}/messages`)}>Back to conversations</button> : null}
            {thread.status === "loading" ? <SkeletonTable /> : (
              <ChatWindow
                conversation={active}
                messages={thread.data ?? []}
                me={user}
                peer={peer}
                onSend={async (body, imageUrl) => {
                  await sendMessage(active.id, body, imageUrl);
                  thread.reload();
                  conversations.reload();
                }}
              />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
