import "./globals.css";

import Nav from "@/components/Navigation";
import Toolbar from "@/components/Toolbar";
import Simulation from "@/components/Simulation";
import { Suspense } from "react";
import { VisitorsProvider } from "@/contexts/visitorContext";

import { Syne } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import type { Metadata } from "next";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Michael Beck",
  description:
    "I'm a 16-year-old experienced in fullstack engineering and UI/UX design. Here's my personal portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/scripts/beforeload.js" />
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/ring2.js"
          defer
        />
      </head>
      <body
        className={`${syne.className} flex items-center justify-center bg-white text-text-light dark:bg-text-light dark:text-text-dark sm:min-h-screen`}
      >
        <main className="flex w-full max-w-[664px] flex-col justify-center gap-6 p-8 py-12">
          <Nav />
          <Suspense>{children}</Suspense>
        </main>
        <Suspense>
          <Toolbar />
        </Suspense>
        {/* <VisitorsProvider>
          <Simulation />
        </VisitorsProvider> */}
        <SpeedInsights />
      </body>
    </html>
  );
}
