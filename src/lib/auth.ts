import crypto from "crypto";
import bcrypt from "bcryptjs";

function sessionSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32 || secret === "rifalvisuals_secret_jwt_key_umroh_2026_production") {
    throw new Error("JWT_SECRET must contain at least 32 bytes and must not use the retired default.");
  }
  return secret;
}

export interface SessionPayload {
  userId: string;
  username: string;
  role: string;
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Lightweight, secure HMAC token signing for admin session cookies
export function signSessionToken(
  payload: Omit<SessionPayload, "exp">,
  expiresInSeconds: number = 60 * 60 * 24 * 7 // 7 days
): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString(
    "base64url"
  );
  const signature = crypto
    .createHmac("sha256", sessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const secret = sessionSecret();
  if (!token || token.length > 4096) return null;

  const [encodedPayload, signature] = token.split(".");
  if (token.split(".").length !== 2 || !encodedPayload || !signature || !/^[A-Za-z0-9_-]+$/.test(encodedPayload) || !/^[A-Za-z0-9_-]{43}$/.test(signature)) return null;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (!payload || typeof payload !== "object" ||
      typeof payload.userId !== "string" || !payload.userId.trim() ||
      typeof payload.username !== "string" || !payload.username.trim() ||
      typeof payload.role !== "string" || !payload.role.trim() ||
      !Number.isSafeInteger(payload.exp) || payload.exp <= now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
