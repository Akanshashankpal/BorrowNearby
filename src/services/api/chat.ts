import type { Conversation, Message } from "@/types";
import { conversations, messages } from "@/services/mock/db";
import { nid } from "@/utils/format";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession } from "./session";

export async function getConversations() {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to open messages.", 401);
  if (!mockMode) {
    const { data } = await api.get<Conversation[]>("/conversations");
    return data;
  }
  await wait(160);
  return conversations
    .filter((entry) => entry.participantIds.includes(session.user.id))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getMessages(conversationId: string) {
  if (!mockMode) {
    const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
    return data;
  }
  await wait(140);
  return messages
    .filter((entry) => entry.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendMessage(conversationId: string, body: string, imageUrl?: string) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to send a message.", 401);
  if (!mockMode) {
    const { data } = await api.post<Message>(`/conversations/${conversationId}/messages`, { body, imageUrl });
    return data;
  }
  await wait(160);
  const conversation = conversations.find((entry) => entry.id === conversationId);
  if (!conversation) throw new ApiError("That conversation is not available.", 404);
  const message: Message = {
    id: nid("msg"),
    conversationId,
    senderId: session.user.id,
    kind: imageUrl ? "image" : "text",
    body,
    imageUrl,
    createdAt: new Date().toISOString(),
    read: true,
  };
  messages.push(message);
  conversation.updatedAt = message.createdAt;
  conversation.peerTyping = false;
  return message;
}

export async function openConversation(otherUserId: string, itemId?: string) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to message someone.", 401);
  const existing = conversations.find(
    (entry) =>
      entry.participantIds.includes(session.user.id) &&
      entry.participantIds.includes(otherUserId) &&
      entry.itemId === itemId,
  );
  if (existing) return existing;
  const created: Conversation = {
    id: nid("c"),
    participantIds: [session.user.id, otherUserId],
    itemId,
    updatedAt: new Date().toISOString(),
    peerTyping: false,
  };
  conversations.unshift(created);
  return created;
}
