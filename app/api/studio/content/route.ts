import { NextResponse } from "next/server";
import { authorized, sameOrigin } from "../../../../lib/cms-auth";
import {
  readState,
  saveContent,
  StoreError,
} from "../../../../lib/content-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!authorized(request))
    return NextResponse.json(
      { error: "Please sign in to Studio." },
      { status: 401 },
    );
  try {
    return NextResponse.json(await readState(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load content. Check server storage and try again." },
      { status: 500 },
    );
  }
}
export async function PUT(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!authorized(request))
    return NextResponse.json(
      { error: "Your session expired. Export your edits, then sign in again." },
      { status: 401 },
    );
  try {
    const body = await request.text();
    if (body.length > 512000)
      return NextResponse.json(
        { error: "Content is too large (maximum 500 KB)." },
        { status: 413 },
      );
    const payload = JSON.parse(body);
    if (
      !["save", "publish"].includes(payload.action) ||
      typeof payload.revision !== "string"
    )
      return NextResponse.json(
        { error: "Invalid save request." },
        { status: 400 },
      );
    return NextResponse.json(
      await saveContent(
        payload.content,
        payload.revision,
        payload.action === "publish",
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof StoreError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    if ((error as NodeJS.ErrnoException).code)
      return NextResponse.json(
        {
          error:
            "Could not save. Check that server storage is writable, then retry.",
        },
        { status: 500 },
      );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid content." },
      { status: 400 },
    );
  }
}
