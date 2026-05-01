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
      </body>
    </html>
  );
}
