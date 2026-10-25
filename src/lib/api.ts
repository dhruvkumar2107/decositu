import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function zodError(error: ZodError) {
  const first = error.issues[0];
  return apiError(first?.message || "Please check the details and try again.", 422, error.flatten());
}
