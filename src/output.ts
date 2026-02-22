let pretty = false;

export function setPretty(value: boolean) {
  pretty = value;
}

export function success(data: unknown) {
  const envelope = { ok: true, data };
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
