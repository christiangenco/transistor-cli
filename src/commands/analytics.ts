import { apiGet } from "../api.js";
import { success } from "../output.js";

export async function showAnalytics(
  id: string,
  opts: { start?: string; end?: string }
) {
  const params: Record<string, any> = {};
  if (opts.start) params.start_date = opts.start;
  if (opts.end) params.end_date = opts.end;

  const data = await apiGet(`/analytics/${id}`, params);
  success(data);
}

export async function allEpisodesAnalytics(
  id: string,
  opts: { start?: string; end?: string }
) {
  const params: Record<string, any> = {};
  if (opts.start) params.start_date = opts.start;
  if (opts.end) params.end_date = opts.end;

  const data = await apiGet(`/analytics/${id}/episodes`, params);
  success(data);
}

export async function episodeAnalytics(
  id: string,
  opts: { start?: string; end?: string }
) {
  const params: Record<string, any> = {};
  if (opts.start) params.start_date = opts.start;
  if (opts.end) params.end_date = opts.end;

  const data = await apiGet(`/analytics/episodes/${id}`, params);
  success(data);
}
