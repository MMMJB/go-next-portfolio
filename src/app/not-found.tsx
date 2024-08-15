import { Frown } from "react-feather";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <p className="h1 flex items-center gap-2.5">
        4
        <Frown size={64} />4
      </p>
      <h1 className="h3">Page not found.</h1>
    </div>
  );
}
