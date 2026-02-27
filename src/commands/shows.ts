import { apiGet, apiPatch } from "../api.js";
import { success } from "../output.js";

export async function listShows(opts: {
  query?: string;
  private?: boolean;
  page?: number;
  per?: number;
  compact?: boolean;
}) {
  const params: Record<string, any> = {};
  if (opts.query) params.query = opts.query;
  if (opts.private !== undefined) params.private = opts.private;
  if (opts.page !== undefined) params["pagination[page]"] = opts.page;
  if (opts.per !== undefined) params["pagination[per]"] = opts.per;

  const data = await apiGet("/shows", params);

  // Strip episodes_ids from list view (can be hundreds of IDs per show)
  if (data?.items) {
    for (const item of data.items) {
      delete item.episodes_ids;
    }
  }

  if (opts.compact && data?.items) {
    const compact = data.items.map((s: any) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      episode_count: s.episode_count,
    }));
    success({ items: compact, meta: data.meta });
    return;
  }

  success(data);
}

export async function getShow(id: string) {
  const data = await apiGet(`/shows/${id}`);
  success(data);
}

export async function updateShow(
  id: string,
  fields: Record<string, any>
) {
  const body: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      body[`show[${key}]`] = value;
    }
  }
  const data = await apiPatch(`/shows/${id}`, body);
  success(data);
}
