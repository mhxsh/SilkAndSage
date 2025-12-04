import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silk & Sage | Ancient Wisdom for the Modern Muse",
  description: "A data-driven modern lifestyle community rooted in Eastern philosophy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
