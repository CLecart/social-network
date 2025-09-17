// Utility type: recursively replace Date by string while preserving keys and structure
export type WithSerializedDates<T> =
  T extends Date
    ? string
    : T extends (infer U)[]
      ? WithSerializedDates<U>[]
      : T extends object
        ? { [K in keyof T]: WithSerializedDates<T[K]> }
        : T;

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function serializeDates<T>(obj: T): WithSerializedDates<T> {
  if (isDate(obj)) {
    return obj.toISOString() as WithSerializedDates<T>;
  }
  if (Array.isArray(obj)) {
    return (obj as unknown[]).map((v) => serializeDates(v)) as WithSerializedDates<T>;
  }
  if (obj !== null && typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, serializeDates(v)] as const);
    return Object.fromEntries(entries) as WithSerializedDates<T>;
  }
  return obj as WithSerializedDates<T>;
}
