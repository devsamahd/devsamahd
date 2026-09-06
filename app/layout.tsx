import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Abdulsamad | Fullstack & Systems Engineer",
  description:
    "Thoughtful software. Solid foundations. Selected work in backend infrastructure, AI, and Web3 by Abdulsamad Abdulsalam.",
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
