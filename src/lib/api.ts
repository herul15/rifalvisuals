import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError, type ZodType } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function readBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try { body = await request.json(); } catch { throw new ApiError(400, "JSON tidak valid."); }
  return schema.parse(body);
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  if (error instanceof ZodError) return NextResponse.json({ success: false, error: "Data tidak valid.", issues: error.issues.map(({ path, message }) => ({ path, message })) }, { status: 400 });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return NextResponse.json({ success: false, error: "Data tidak ditemukan." }, { status: 404 });
  console.error("API operation failed:", error instanceof Error ? error.message : "Unknown error");
  return NextResponse.json({ success: false, error: "Terjadi kesalahan internal pada server." }, { status: 500 });
}
