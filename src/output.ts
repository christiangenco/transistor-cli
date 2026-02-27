let pretty = false;

export function setPretty(value: boolean) {
  pretty = value;
}

/** Recursively strip null, undefined, empty string, and empty array values */
export function stripEmpty(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(stripEmpty);
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value === null || value === undefined || value === "") continue;
      if (Array.isArray(value) && value.length === 0) continue;
      result[key] = stripEmpty(value);
    }
    return result;
  }
  return obj;
}

export function success(data: unknown) {
  const envelope = { ok: true, data: stripEmpty(data) };
  if (pretty) {
    console.log(JSON.stringify(envelope, null, 2));
  } else {
    console.log(JSON.stringify(envelope));
  }
}

export function fail(error: string, code?: string) {
  const envelope: Record<string, unknown> = { ok: false, error };
  if (code) envelope.code = code;
  if (pretty) {
    console.log(JSON.stringify(envelope, null, 2));
  } else {
    console.log(JSON.stringify(envelope));
  }
  process.exit(1);
}
