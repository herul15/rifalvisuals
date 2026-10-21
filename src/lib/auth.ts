import crypto from "crypto";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "rifalvisuals_secret_jwt_key_umroh_2026_production";

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
    .createHmac("sha256", JWT_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes(".")) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  if (signature !== expectedSignature) return null;

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
