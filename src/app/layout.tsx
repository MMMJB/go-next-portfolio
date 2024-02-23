import "./globals.css";

import { Syne } from "next/font/google";

import type { Metadata } from "next";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.className} text-text-light dark:text-text-dark dark:bg-text-light grid min-h-screen place-items-center`}
      >
        {children}
      </body>
    </html>
  );
}
