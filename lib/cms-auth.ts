import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
export const SESSION_COOKIE = "portfolio_studio";
export const SESSION_SECONDS = 60 * 60 * 8;
const signingKey = () => process.env.CMS_SESSION_SECRET || "";
export function isConfigured() {
  return (
    (process.env.CMS_PASSWORD?.length || 0) >= 24 && signingKey().length >= 32
  );
}
export function localDevelopment(host: string | null) {
  return (
    process.env.NODE_ENV === "development" &&
    !process.env.CMS_PASSWORD &&
    ["localhost", "127.0.0.1", "[::1]"].includes(
      (host || "").replace(/:\d+$/, ""),
    )
  );
}
function equals(a: string, b: string) {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function passwordMatches(password: string) {
  if (!isConfigured()) return false;
  const hash = (value: string) =>
    createHmac("sha256", signingKey()).update(value).digest("hex");
  return equals(hash(password), hash(process.env.CMS_PASSWORD!));
}
export function issueSession(now = Date.now()) {
  if (!isConfigured())
    throw new Error("Studio authentication is not configured.");
  const data = `${now + SESSION_SECONDS * 1000}.${randomBytes(20).toString("hex")}`;
  return `${data}.${createHmac("sha256", signingKey()).update(data).digest("hex")}`;
}
export function validSession(token: string | undefined, now = Date.now()) {
  if (!isConfigured() || !token) return false;
  const [expires, nonce, signature, extra] = token.split(".");
  if (
    extra ||
    !signature ||
    !nonce ||
    !Number.isFinite(Number(expires)) ||
    Number(expires) <= now ||
    Number(expires) > now + SESSION_SECONDS * 1000
  )
    return false;
  return equals(
    signature,
    createHmac("sha256", signingKey())
      .update(`${expires}.${nonce}`)
      .digest("hex"),
  );
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  try {
    return (
      !!origin &&
      new URL(origin).host === request.headers.get("host") &&
      ["http:", "https:"].includes(new URL(origin).protocol)
    );
  } catch {
    return false;
  }
}
export function authorized(request: Request) {
  if (localDevelopment(request.headers.get("host"))) return true;
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return validSession(cookie);
}
