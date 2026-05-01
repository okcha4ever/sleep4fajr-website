import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleep4Fajr",
  description:
    "Find the best times to sleep before Fajr and fetch prayer times by location.",
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
