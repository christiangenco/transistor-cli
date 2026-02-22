import axios, { AxiosInstance, AxiosError } from "axios";
import { getApiKey } from "./config.js";
import { fail } from "./output.js";

let client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  if (!client) {
    const apiKey = getApiKey();
    client = axios.create({
      baseURL: "https://api.transistor.fm/v1",
      timeout: 30000,
      headers: { "x-api-key": apiKey },
    });
  }
  return client;
}

// Flatten a JSON:API resource: merge id + attributes, add relationship IDs
function flattenResource(resource: any): any {
  if (!resource || typeof resource !== "object") return resource;
  const flat: any = { id: resource.id, type: resource.type };
  if (resource.attributes) {
    Object.assign(flat, resource.attributes);
  }
  if (resource.relationships) {
    for (const [key, rel] of Object.entries(resource.relationships as any)) {
      const relData = (rel as any)?.data;
      if (Array.isArray(relData)) {
        flat[`${key}_ids`] = relData.map((r: any) => r.id);
      } else if (relData?.id) {
        flat[`${key}_id`] = relData.id;
      }
    }
  }
  return flat;
}

// Flatten response data — handles single resource, array, or nested attributes-only
export function flatten(body: any): any {
  if (!body) return body;
  const data = body.data;
  if (Array.isArray(data)) {
    const result: any = {
      items: data.map(flattenResource),
    };
    if (body.meta) {
      result.meta = body.meta;
    }
    return result;
  }
  if (data && typeof data === "object") {
    const flat = flattenResource(data);
    if (body.included) {
      flat.included = (body.included as any[]).map(flattenResource);
    }
    return flat;
  }
  return body;
}

export async function apiGet(path: string, params?: Record<string, any>): Promise<any> {
  try {
    const res = await getClient().get(path, { params });
    return flatten(res.data);
  } catch (e) {
    handleError(e);
  }
}

export async function apiPost(path: string, data?: any): Promise<any> {
  try {
    const res = await getClient().post(path, data);
    return flatten(res.data);
  } catch (e) {
    handleError(e);
  }
}

export async function apiPatch(path: string, data?: any): Promise<any> {
  try {
    const res = await getClient().patch(path, data);
    return flatten(res.data);
  } catch (e) {
    handleError(e);
  }
}

export async function apiDelete(path: string, params?: Record<string, any>): Promise<any> {
  try {
    const res = await getClient().delete(path, { params });
    return flatten(res.data);
  } catch (e) {
    handleError(e);
  }
}

function handleError(e: unknown): never {
  if (e instanceof AxiosError) {
    const status = e.response?.status;
    const body = e.response?.data;
    const message =
      body?.errors?.[0]?.detail ||
      body?.error ||
      body?.message ||
      e.message;
    fail(`API error (${status}): ${message}`, `HTTP_${status}`);
  }
  fail((e as Error).message || String(e));
  throw e; // unreachable but satisfies TS
}
