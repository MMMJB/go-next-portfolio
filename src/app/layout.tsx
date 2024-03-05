import "./globals.css";

import Nav from "@/components/Navigation";
// import { GridProvider } from "@/contexts/gridContext";
// import Grid from "@/components/Grid";
import DarkModeToggle from "@/components/DarkModeToggle";

import { Syne } from "next/font/google";

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
        <script src="/scripts/theme.js" />
      </head>
      <body
        className={`${syne.className} grid min-h-screen place-items-center text-text-light dark:bg-text-light dark:text-text-dark`}
      >
        {/* <GridProvider>
          <Grid rows={20} />
        </GridProvider> */}
        <main className="rounded p-8">
          <div className="flex w-full max-w-[600px] flex-col gap-6">
            {children}
            <Nav />
          </div>
        </main>
        <DarkModeToggle />
      </body>
    </html>
  );
}
