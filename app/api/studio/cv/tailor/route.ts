import { NextResponse } from "next/server";
import { cvAccess, cvBody, cvError } from "../../../../../lib/cv-http";
import { validateCv } from "../../../../../lib/cv";
import { tailorCv, TailorError } from "../../../../../lib/cv-tailor";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let count = 0,
  resetAt = 0,
  active = false;
export async function POST(request: Request) {
  const denied = cvAccess(request, true);
  if (denied) return denied;
  if (active)
    return NextResponse.json(
      {
        error: "A suggestion is already being prepared. Please wait a moment.",
      },
      { status: 429 },
    );
  if (Date.now() > resetAt) {
    count = 0;
    resetAt = Date.now() + 600000;
  }
  if (count >= 10)
    return NextResponse.json(
      {
        error:
          "Pause for a few minutes before requesting more suggestions. Manual editing still works.",
      },
      { status: 429 },
    );
  active = true;
  try {
    const body = await cvBody(request, 200000);
    const cv = validateCv(body.cv);
    if (typeof body.job !== "string")
      throw new Error("Paste the job description first.");
    count++;
    return NextResponse.json(await tailorCv(cv, body.job), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof TailorError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return cvError(error);
  } finally {
    active = false;
  }
}
