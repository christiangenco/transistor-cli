import { apiGet, apiPost, apiPatch, apiDelete } from "../api.js";
import { success } from "../output.js";

export async function listSubscribers(opts: {
  showId: string;
  query?: string;
  page?: number;
  per?: number;
}) {
  const params: Record<string, any> = { show_id: opts.showId };
  if (opts.query) params.query = opts.query;
  if (opts.page !== undefined) params["pagination[page]"] = opts.page;
  if (opts.per !== undefined) params["pagination[per]"] = opts.per;

  const data = await apiGet("/subscribers", params);
  success(data);
}

export async function getSubscriber(id: string) {
  const data = await apiGet(`/subscribers/${id}`);
  success(data);
}

export async function createSubscriber(opts: {
  showId: string;
  email: string;
  skipWelcomeEmail?: boolean;
}) {
  const params: Record<string, any> = {
    show_id: opts.showId,
    email: opts.email,
  };
  if (opts.skipWelcomeEmail) params.skip_welcome_email = true;

  const data = await apiPost("/subscribers", params);
  success(data);
}

export async function createSubscribersBatch(opts: {
  showId: string;
  emails: string[];
  skipWelcomeEmail?: boolean;
}) {
  const params: Record<string, any> = {
    show_id: opts.showId,
    emails: opts.emails,
  };
  if (opts.skipWelcomeEmail) params.skip_welcome_email = true;

  const data = await apiPost("/subscribers/batch", params);
  success(data);
}

export async function updateSubscriber(id: string, email: string) {
  const data = await apiPatch(`/subscribers/${id}`, {
    subscriber: { email },
  });
  success(data);
}

export async function deleteSubscriberByEmail(showId: string, email: string) {
  const data = await apiDelete("/subscribers", { show_id: showId, email });
  success(data);
}

export async function deleteSubscriberById(id: string) {
  const data = await apiDelete(`/subscribers/${id}`);
  success(data);
}
