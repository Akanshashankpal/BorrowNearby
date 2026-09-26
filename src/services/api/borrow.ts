import type { BorrowPlaceInput, BorrowQuote, BorrowRequest, ConditionReport } from "@/types";
import { items, requests } from "@/services/mock/db";
import { daysBetween, nid } from "@/utils/format";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession } from "./session";

function quoteFor(itemId: string, startDate: string, endDate: string): BorrowQuote {
  const item = items.find((entry) => entry.id === itemId);
  if (!item) throw new ApiError("This item is no longer listed.", 404);
  const days = daysBetween(startDate, endDate);
  const rental = item.pricePerDay * days;
  const serviceFee = item.priceType === "free" ? 0 : Math.round(rental * 0.08);
  const deposit = item.deposit;
  return {
    rental,
    serviceFee,
    deposit,
    total: rental + serviceFee + deposit,
    currency: "INR",
    days,
  };
}

export async function getBorrowQuote(itemId: string, startDate: string, endDate: string) {
  if (!startDate || !endDate) throw new ApiError("Choose a start and end date.", 422);
  if (!mockMode) {
    const { data } = await api.post<BorrowQuote>("/borrow/quote", { itemId, startDate, endDate });
    return data;
  }
  await wait(180);
  return quoteFor(itemId, startDate, endDate);
}

export async function placeBorrowRequest(input: BorrowPlaceInput) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to send a request.", 401);
  if (session.user.role !== "user") throw new ApiError("Borrowing uses a user account.", 403);
  const item = items.find((entry) => entry.id === input.itemId);
  if (!item) throw new ApiError("This item is no longer listed.", 404);
  if (item.ownerId === session.user.id) throw new ApiError("You can't request your own item.", 422);
  if (!mockMode) {
    const { data } = await api.post<BorrowRequest>("/borrow/requests", input);
    return data;
  }
  await wait(320);
  const quote = quoteFor(input.itemId, input.startDate, input.endDate);
  const request: BorrowRequest = {
    id: nid("req"),
    itemId: input.itemId,
    borrowerId: session.user.id,
    ownerId: item.ownerId,
    status: "pending",
    startDate: input.startDate,
    endDate: input.endDate,
    message: input.message,
    rental: quote.rental,
    serviceFee: quote.serviceFee,
    deposit: quote.deposit,
    total: quote.total,
    currency: "INR",
    createdAt: new Date().toISOString(),
    timeline: [
      { key: "sent", label: "Request sent", at: new Date().toISOString(), done: true, current: true },
      { key: "accepted", label: "Accepted", done: false },
      { key: "pickup", label: "Pickup", done: false },
      { key: "active", label: "Active borrow", done: false },
      { key: "return", label: "Return", done: false },
      { key: "completed", label: "Completed", done: false },
    ],
  };
  requests.unshift(request);
  item.requestCount += 1;
  return request;
}

export async function getRequest(id: string) {
  if (!mockMode) {
    const { data } = await api.get<BorrowRequest>(`/borrow/requests/${id}`);
    return data;
  }
  await wait(160);
  const request = requests.find((entry) => entry.id === id);
  if (!request) throw new ApiError("That request could not be found.", 404);
  return request;
}

export async function getMyRequests(direction: "sent" | "received") {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to see requests.", 401);
  if (!mockMode) {
    const { data } = await api.get<BorrowRequest[]>("/borrow/requests", { params: { direction } });
    return data;
  }
  await wait(180);
  return requests.filter((entry) =>
    direction === "sent" ? entry.borrowerId === session.user.id : entry.ownerId === session.user.id,
  );
}

export async function setRequestStatus(id: string, status: BorrowRequest["status"]) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to update a request.", 401);
  if (!mockMode) {
    const { data } = await api.post<BorrowRequest>(`/borrow/requests/${id}/status`, { status });
    return data;
  }
  await wait(220);
  const request = requests.find((entry) => entry.id === id);
  if (!request) throw new ApiError("That request could not be found.", 404);
  const mine = request.ownerId === session.user.id || request.borrowerId === session.user.id;
  if (!mine) throw new ApiError("You can't update this request.", 403);
  request.status = status;
  request.timeline = request.timeline.map((step) => {
    if (status === "accepted" && (step.key === "sent" || step.key === "accepted")) {
      return { ...step, done: true, current: step.key === "accepted", at: step.at ?? new Date().toISOString() };
    }
    if (status === "rejected" || status === "cancelled") {
      return { ...step, current: false };
    }
    if (status === "completed") {
      return { ...step, done: true, current: step.key === "completed", at: step.at ?? new Date().toISOString() };
    }
    return step;
  });
  return request;
}

export async function saveConditionReport(id: string, report: ConditionReport) {
  if (!mockMode) {
    const { data } = await api.post<BorrowRequest>(`/borrow/requests/${id}/condition`, report);
    return data;
  }
  await wait(200);
  const request = requests.find((entry) => entry.id === id);
  if (!request) throw new ApiError("That request could not be found.", 404);
  request.conditionReport = report;
  return request;
}
