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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="text-text-light">
        <Nav />
        <div className="mx-auto flex max-w-7xl flex-col gap-[120px] pb-10 pt-20">
          <Suspense>{children}</Suspense>
        </div>
        {/* <VisitorsProvider>
          <Simulation />
        </VisitorsProvider> */}
        <SpeedInsights />
      </body>
    </html>
  );
}
