import { randomBytes } from "node:crypto";

// Unit tests never consume the application's real session secret.
process.env.JWT_SECRET = randomBytes(48).toString("hex");
