import "./globals.css";

import Nav from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimationPlayer from "@/components/AnimationPlayer";
import ProjectDisplay from "@/components/ProjectDisplay";
import Loading from "@/components/Loading";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import type { Metadata } from "next";

import m from "@/lib/metadata";

export const metadata: Metadata = m;

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

        <link rel="shortcut icon" href="/meta/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/meta/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/meta/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/meta/favicon-16x16.png"
        />
        <link rel="manifest" href="/meta/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/meta/safari-pinned-tab.svg"
          color="#292d44"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff"></meta>
      </head>
      <body className="overflow-x-hidden text-text-light">
        <Nav />
        <Suspense fallback={<Loading />}>
          {/* <AnimationPlayer> */}
          <div className="mx-auto flex max-w-7xl flex-col gap-[120px] pb-10 pt-20">
            {children}
            <ProjectDisplay />
            <Footer />
          </div>
          {/* </AnimationPlayer> */}
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
