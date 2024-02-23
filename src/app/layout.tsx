import "./globals.css";

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
      <body
        className={`${syne.className} grid min-h-screen place-items-center text-text-light dark:bg-text-light dark:text-text-dark`}
      >
        {children}
      </body>
    </html>
  );
}
