const fallback = "https://samahd.is-a.dev";

function resolveSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || fallback;
  try {
    const url = new URL(candidate);
    if (!["https:", "http:"].includes(url.protocol))
      throw new Error("Unsupported protocol");
    return new URL(url.toString().replace(/\/$/, ""));
  } catch {
    return new URL(fallback);
  }
}

export const siteUrl = resolveSiteUrl();
