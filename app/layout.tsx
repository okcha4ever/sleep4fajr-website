import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sleep4fajr.vercel.app"),
  title: "Sleep4Fajr | Find the best time to sleep before Fajr",
  description:
    "Check prayer times for your city and find the best bedtime before Fajr using complete 90-minute sleep cycles.",
  openGraph: {
    title: "Sleep4Fajr | Find the best time to sleep before Fajr",
    description:
      "Check prayer times for your city and find the best bedtime before Fajr using complete 90-minute sleep cycles.",
    url: "https://sleep4fajr.vercel.app",
    siteName: "Sleep4Fajr",
    type: "website",
    images: [
      {
        url: "/sleep4fajr-og.png",
        alt: "Sleep4Fajr preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleep4Fajr | Find the best time to sleep before Fajr",
    description:
      "Check prayer times for your city and find the best bedtime before Fajr using complete 90-minute sleep cycles.",
    images: ["/sleep4fajr-og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon180x180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="px-6 pb-8 pt-2 text-center text-sm text-[#4d5b4f] sm:px-8">
          Made with {"<3"} by{" "}
          <a
            href="https://aminedevs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#152018] underline decoration-[#22543d]/35 underline-offset-4 transition hover:text-[#22543d]"
          >
            Amine Khiari
          </a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
