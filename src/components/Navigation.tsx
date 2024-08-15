import { ArrowRight } from "react-feather";
import { Button } from "./base/Input";
import Link from "@/components/base/Link";

export default function Nav() {
  return (
    <div className="w-full border-b border-border bg-white px-10 py-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <img height="31" src="/logo.png" alt="MJB" />
        </Link>
        <div className="p flex items-center gap-10">
          <Link href="/projects">Projects</Link>
          <Link href="/journey">Journey</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/feedback">
            <Button>
              Leave some feedback
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
