"use client";

import { usePathname } from "next/navigation";

import { ArrowUpRight } from "react-feather";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  const alternate = pathname === "/feedback";

  return (
    <footer className="collision flex flex-col gap-20 rounded-4xl bg-text-light pb-10 pt-20 font-medium text-surface">
      <div className="flex flex-col items-center gap-10">
        <h2 className="h1 text-center">
          {!alternate ? (
            <>
              Feedback?
              <br />
              Leave a comment!
            </>
          ) : (
            <>
              Thanks for leaving
              <br />a comment 😁
            </>
          )}
        </h2>
        {!alternate && (
          <Link href="/feedback">
            <button className="flex items-center justify-center gap-2 rounded-full border border-surface px-10 py-2 text-[18px]/[36px]">
              Let&rsquo;s do it!
              <ArrowUpRight size={24} />
            </button>
          </Link>
        )}
      </div>
      <div className="p flex flex-col items-center gap-5">
        <div className="flex gap-10">
          <Link href="/projects">Projects</Link>
          <Link href="/journey">Journey</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/feedback">Contact</Link>
        </div>
        <span className="text-surface/50">© 2024 Michael Beck</span>
      </div>
    </footer>
  );
}
