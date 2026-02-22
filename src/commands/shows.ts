import { apiGet, apiPatch } from "../api.js";
import { success } from "../output.js";

export async function listShows(opts: {
  query?: string;
  private?: boolean;
  page?: number;
  per?: number;
}) {
  const params: Record<string, any> = {};
  if (opts.query) params.query = opts.query;
  if (opts.private !== undefined) params.private = opts.private;
  if (opts.page !== undefined) params["pagination[page]"] = opts.page;
  if (opts.per !== undefined) params["pagination[per]"] = opts.per;

  const data = await apiGet("/shows", params);
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
