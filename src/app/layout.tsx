import "./globals.css";

import Nav from "@/components/Navigation";
import Simulation from "@/components/Simulation";
import { Suspense } from "react";
import { VisitorsProvider } from "@/contexts/visitorContext";

import { SpeedInsights } from "@vercel/speed-insights/next";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Michael Beck | Portfolio",
  description:
    "I'm a 17-year-old experienced in web dev and UI/UX. I'm the founder of Launch and a frontend developer at a few other projects. Here's my personal portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex items-center justify-center bg-white text-text-light dark:bg-text-light dark:text-text-dark sm:min-h-screen`}
      >
        <main className="flex w-full max-w-[664px] flex-col justify-center gap-6 p-8 py-12">
          <Nav />
          <Suspense>{children}</Suspense>
        </main>
        {/* <VisitorsProvider>
          <Simulation />
        </VisitorsProvider> */}
        <SpeedInsights />
      </body>
    </html>
  );
}
