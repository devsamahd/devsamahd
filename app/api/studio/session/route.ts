import { NextResponse } from "next/server";
import {
  isConfigured,
  issueSession,
  localDevelopment,
  passwordMatches,
  sameOrigin,
  SESSION_COOKIE,
  SESSION_SECONDS,
} from "../../../../lib/cms-auth";
export const runtime = "nodejs";
// Global per-process budget avoids trusting spoofable forwarded IP headers.
let failures = 0;
let resetAt = 0;
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (localDevelopment(request.headers.get("host")))
    return NextResponse.json({ ok: true });
  if (!isConfigured())
    return NextResponse.json(
      {
        error:
          "Set CMS_PASSWORD (24+ characters) and CMS_SESSION_SECRET (32+ characters) on the server to enable Studio.",
      },
      { status: 503 },
    );
  if (Date.now() > resetAt) {
    failures = 0;
    resetAt = Date.now() + 10 * 60 * 1000;
  }
  if (failures >= 5)
    return NextResponse.json(
      { error: "Too many attempts. Please try again in 10 minutes." },
      { status: 429 },
    );
  let password: unknown;
  try {
    const text = await request.text();
    if (text.length > 2048) throw new Error();
    password = JSON.parse(text).password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof password !== "string" || !passwordMatches(password)) {
    failures++;
    return NextResponse.json(
      { error: "That password isn’t correct." },
      { status: 401 },
    );
  }
  failures = 0;
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, issueSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
