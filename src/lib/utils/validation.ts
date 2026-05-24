import { z } from "zod";

type ZodIssueInfo = {
  path: string;
  code: string;
  message: string;
};

type ValidationMeta = {
  label?: string;
  schemaDescription?: string;
  issues?: ZodIssueInfo[];
};

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, opts?: { label?: string }): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const flattened = result.error.flatten();
    const fieldErrors = Object.fromEntries(
      Object.entries(flattened.fieldErrors).map(([field, errors]) => [
        field,
        (errors as string[])[0] ?? "Invalid value",
      ])
    );

    const issues: ZodIssueInfo[] = result.error.issues.map((i) => ({
      path: i.path.join("."),
      code: i.code,
      message: i.message,
    }));

    const meta: ValidationMeta = {
      label: opts?.label,
      schemaDescription: schema.description,
      issues,
    };

    // Server-side verbose logging to ease debugging
    const isServer = typeof window === "undefined";
    if (isServer) {
      const where = opts?.label || schema.description || "Unknown schema";
      // Summarize data shape to keep logs readable
      let dataShape: string | string[] = typeof data;
      try {
        if (data && typeof data === "object") {
          dataShape = Object.keys(data as any).slice(0, 20);
        }
      } catch {}
      console.error(`❌ Zod validation failed [${where}]`);
      console.error("   • schema:", schema.description || "(no description)");
      console.error("   • fields:", fieldErrors);
      console.error("   • issues:", issues);
      console.error("   • data shape:", dataShape);
    }

    throw new ValidationError(fieldErrors, meta);
  }
  return result.data;
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>;
  issues?: ZodIssueInfo[];
  schemaDescription?: string;
  label?: string;

  constructor(fieldErrors: Record<string, string>, meta?: ValidationMeta) {
    super("Invalid data");
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
    if (meta) {
      this.issues = meta.issues;
      this.schemaDescription = meta.schemaDescription;
      this.label = meta.label;
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      schema: this.schemaDescription,
      label: this.label,
      fieldErrors: this.fieldErrors,
      issues: this.issues,
    };
  }
}
