import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { verifyPassword } from "./password";

const COOKIE_NAME = "sk_admin";
const SESSION_DAYS = 7;

function getSetting(key: string): string {
  const row = getDb()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? "";
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

type AttemptTracker = { count: number; lastAttempt: number; lockedUntil: number };
const loginAttempts = new Map<string, AttemptTracker>();

export function checkLoginRateLimit(key = "admin"): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const tracker = loginAttempts.get(key);
  if (tracker && tracker.lockedUntil > now) {
    return { allowed: false, remainingSeconds: Math.ceil((tracker.lockedUntil - now) / 1000) };
  }
  return { allowed: true };
}

export function recordFailedLogin(key = "admin"): { locked: boolean; remainingAttempts: number } {
  const now = Date.now();
  const tracker = loginAttempts.get(key) ?? { count: 0, lastAttempt: now, lockedUntil: 0 };

  if (now - tracker.lastAttempt > LOCKOUT_MS) {
    tracker.count = 0;
  }

  tracker.count += 1;
  tracker.lastAttempt = now;

  if (tracker.count >= MAX_FAILED_ATTEMPTS) {
    tracker.lockedUntil = now + LOCKOUT_MS;
    loginAttempts.set(key, tracker);
    return { locked: true, remainingAttempts: 0 };
  }

  loginAttempts.set(key, tracker);
  return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - tracker.count };
}

export function recordSuccessfulLogin(key = "admin") {
  loginAttempts.delete(key);
}

export function checkAdminCredentials(password: string): boolean {
  const hash = getSetting("admin_password_hash");
  if (!hash) return false;
  return verifyPassword(password, hash);
}

export function createSessionToken(): string {
  const secret = getSetting("session_secret");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expires}.${sign(String(expires), secret)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig) return false;
  if (Number(expires) < Date.now()) return false;
  const secret = getSetting("session_secret");
  return safeEqual(sig, sign(expires, secret));
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return isValidSessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
