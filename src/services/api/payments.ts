import type { PaymentIntent, Transaction } from "@/types";
import { requests, transactions } from "@/services/mock/db";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession } from "./session";

const intents = new Map<string, PaymentIntent>();

export async function getPaymentIntent(requestId: string): Promise<PaymentIntent> {
  if (!mockMode) {
    const { data } = await api.get<PaymentIntent>(`/payments/${requestId}`);
    return data;
  }
  await wait(200);
  const request = requests.find((entry) => entry.id === requestId);
  if (!request) throw new ApiError("No payable request was found.", 404);
  const existing = intents.get(requestId);
  if (existing) return existing;
  const intent: PaymentIntent = {
    id: `pay-${requestId}`,
    requestId,
    rental: request.rental,
    serviceFee: request.serviceFee,
    deposit: request.deposit,
    total: request.total,
    currency: "INR",
    status: request.total === 0 ? "confirmed" : "requires_payment",
  };
  intents.set(requestId, intent);
  return intent;
}

export async function submitPayment(requestId: string, method: "upi" | "card") {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to pay.", 401);
  if (!mockMode) {
    const { data } = await api.post<PaymentIntent>(`/payments/${requestId}/confirm`, { method });
    return data;
  }
  await wait(500);
  const intent = await getPaymentIntent(requestId);
  if (intent.status === "confirmed") return intent;
  intent.status = "confirmed";
  intent.method = method;
  transactions.unshift({
    id: `txn-${Date.now()}`,
    userId: session.user.id,
    title: `Payment for ${requestId}`,
    amount: intent.total,
    kind: "rental",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  });
  return intent;
}

export async function getTransactions() {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to see payments.", 401);
  if (!mockMode) {
    const { data } = await api.get<Transaction[]>("/payments");
    return data;
  }
  await wait(160);
  return transactions.filter((entry) => entry.userId === session.user.id);
}
