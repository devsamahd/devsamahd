import { NextResponse } from "next/server";
import { cvAccess, cvBody, cvError } from "../../../../../lib/cv-http";
import { validateCv, cvText } from "../../../../../lib/cv";
import { cvDocx } from "../../../../../lib/cv-docx";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const denied = cvAccess(request, true);
  if (denied) return denied;
  try {
    const body = await cvBody(request, 200000),
      cv = validateCv(body.cv);
    if (!["docx", "txt"].includes(body.format))
      throw new Error("Choose Word or plain text export.");
    const name = `${cv.name}-${cv.title}`
      .replace(/[^a-zA-Z0-9-]+/g, "-")
      .slice(0, 100);
    const output =
      body.format === "docx" ? new Uint8Array(await cvDocx(cv)) : cvText(cv);
    return new NextResponse(output, {
      headers: {
        "Content-Type":
          body.format === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${name}.${body.format}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return cvError(e);
  }
}
