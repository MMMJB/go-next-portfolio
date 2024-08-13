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

  const next = pathname.match(/\/projects\/.*/)
    ? `/projects/${id}`
    : `${pathname}?p=${id}`;

  return (
    <Link {...rest} href={next}>
      {children}
    </Link>
  );
}
