import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const ADMIN_AUTH_COOKIE = "admin_auth";

function getAdminPassword(): string {
  const password = process.env.ADMIN_PAGE_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PAGE_PASSWORD is missing");
  }
  return password;
}

function getSessionToken(password: string): string {
  return createHash("sha256").update(`admin:${password}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  if (!cookieValue) return false;

  try {
    const expected = getSessionToken(getAdminPassword());
    return safeEqual(cookieValue, expected);
  } catch {
    return false;
  }
}

export async function setAdminAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  const value = getSessionToken(getAdminPassword());
  cookieStore.set(ADMIN_AUTH_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // Needed so server routes like `/api/admin/*` can read the cookie too.
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_AUTH_COOKIE);
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const expected = getAdminPassword();
  return safeEqual(input, expected);
}
