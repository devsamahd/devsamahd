import { NextResponse } from "next/server";
import { authorized, sameOrigin } from "./cms-auth";
import { StoreError } from "./content-store";
export function cvAccess(request: Request, write = false) {
  if (write && !sameOrigin(request))
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!authorized(request))
    return NextResponse.json(
      {
        error:
          "Please sign in again. Your edits are still here; download a backup before leaving.",
      },
      { status: 401 },
    );
  return null;
}
export async function cvBody(request: Request, maximum = 3000000) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request body.");
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximum) {
      await reader.cancel();
      throw new StoreError("This CV workspace is too large.", 413);
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function cvError(error: unknown) {
  if (error instanceof StoreError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  if ((error as NodeJS.ErrnoException)?.code)
    return NextResponse.json(
      {
        error:
          "Storage is unavailable. Your edits are still here; please retry or download a backup.",
      },
      { status: 500 },
    );
  return NextResponse.json(
    {
      error:
        error instanceof Error ? error.message : "Could not process the CV.",
    },
    { status: 400 },
  );
}
