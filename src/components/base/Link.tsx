"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

export default Link;

export function ProjectLink({
  id,
  children,
  ...rest
}: React.HTMLAttributes<HTMLAnchorElement> & {
  id: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link {...rest} href={`${pathname}?p=${id}`}>
      {children}
    </Link>
  );
}
