import "./globals.css";
import type { Metadata } from "next";
import { siteUrl } from "../lib/site";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Abdulsamad Abdulsalam | Backend & Platform Engineer",
    template: "%s | Abdulsamad Abdulsalam",
  },
  description:
    "Backend and platform engineer building APIs, network infrastructure, developer tools, and dependable systems.",
  applicationName: "Abdulsamad Abdulsalam",
  authors: [{ name: "Abdulsamad Abdulsalam", url: siteUrl.toString() }],
  creator: "Abdulsamad Abdulsalam",
  publisher: "Abdulsamad Abdulsalam",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Abdulsamad Abdulsalam",
    title: "Abdulsamad Abdulsalam | Backend & Platform Engineer",
    description:
      "Backend and platform engineer building APIs, network infrastructure, developer tools, and dependable systems.",
    locale: "en_NG",
  },
  twitter: {
    card: "summary",
    title: "Abdulsamad Abdulsalam | Backend & Platform Engineer",
    description:
      "Backend and platform engineer building APIs, network infrastructure, developer tools, and dependable systems.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
