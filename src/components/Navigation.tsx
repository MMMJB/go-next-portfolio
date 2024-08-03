import { ArrowRight } from "react-feather";
import Link from "next/link";

export default function Nav() {
  return (
    <div className="border-border w-full border-b px-10 py-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <img height="31" src="/logo.png" alt="MJB" />
        </Link>
        <div className="p flex items-center gap-10">
          <Link href="/projects">Projects</Link>
          <Link href="/journey">Journey</Link>
          <Link href="/resume">Resume</Link>
          <Link
            href="/feedback"
            className="border-border flex items-center gap-1 rounded-md border px-5 py-3"
          >
            Leave some feedback
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>
    </div>
  );
}
