import { apiGet, apiPost, apiDelete } from "../api.js";
import { success } from "../output.js";

export async function listWebhooks(showId: string) {
  const data = await apiGet("/webhooks", { show_id: showId });
  success(data);
}

export async function createWebhook(opts: {
  showId: string;
  eventName: string;
  url: string;
}) {
  const data = await apiPost("/webhooks", {
    show_id: opts.showId,
    event_name: opts.eventName,
    url: opts.url,
  });
  success(data);
}

export async function deleteWebhook(id: string) {
  const data = await apiDelete(`/webhooks/${id}`);
  success(data);
}
