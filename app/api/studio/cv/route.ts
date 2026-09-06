import { NextResponse } from "next/server";
import { cvAccess, cvBody, cvError } from "../../../../lib/cv-http";
import { readCvState, saveCvState } from "../../../../lib/cv-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const denied = cvAccess(request);
  if (denied) return denied;
  try {
    return NextResponse.json(await readCvState(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return cvError(e);
  }
}
export async function PUT(request: Request) {
  const denied = cvAccess(request, true);
  if (denied) return denied;
  try {
    const payload = await cvBody(request);
    if (typeof payload.revision !== "string")
      throw new Error("Missing CV revision.");
    return NextResponse.json(
      await saveCvState(payload.workspace, payload.revision),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cvError(e);
  }
}
