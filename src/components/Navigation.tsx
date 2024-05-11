"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Skills",
    description: "Tools & technologies.",
    link: "/skills",
    icon: "/skills.png",
    animation: "animate-bounce",
  },
  {
    title: "Projects",
    description: "My proudest works.",
    link: "/projects",
    icon: "/projects.png",
    animation: "animate-spin-slow",
  },
  {
    title: "Journey",
    description: "How I got here.",
    link: "/journey",
    icon: "/journey.png",
    animation: "animate-jump",
  },
  {
    title: "Contact",
    description: "Let's get in touch!",
    link: "/contact",
    icon: "/contact.png",
    animation: "animate-jiggle",
  },
];

export function NavigationCard({
  title,
  description,
  link,
  icon,
  animation,
}: {
  title: string;
  description: string;
  link: string;
  icon: string;
  animation: string;
}) {
  const [animationPlaying, setAnimationPlaying] = useState(false);

  return (
    <a
      href={link}
      onMouseEnter={() => setAnimationPlaying(true)}
      className="group flex w-full flex-col gap-12 rounded border border-card-light-border bg-card-light p-3 transition-colors hover:bg-card-light-hover dark:border-card-dark-border dark:bg-card-dark dark:hover:bg-card-dark-hover"
    >
      <div className="h-8 w-8">
        <img
          onAnimationEnd={() => setAnimationPlaying(false)}
          className={`h-full w-full ${animationPlaying && animation}`}
          alt=""
          src={icon}
        />
      </div>
      <div className="flex flex-col text-end">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs opacity-75">{description}</span>
      </div>
    </a>
  );
}

export function HomeNav() {
  return (
    <div className="collision flex flex-col gap-3">
      <nav className="grid w-full grid-cols-2 gap-3 sm:flex">
        {navItems.map((item) => (
          <NavigationCard key={item.title} {...item} />
        ))}
      </nav>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <nav className="sticky top-12 flex h-10 w-full items-center gap-2">
      {navItems.map((item) => (
        <a
          key={item.title}
          href={item.link}
          className={`group flex items-center gap-3 rounded-full border-card-light-border bg-card-light px-3 dark:border-card-dark-border dark:bg-card-dark ${
            pathname === item.link
              ? "flex-grow border py-1.5"
              : "max-w-10 overflow-hidden py-2 transition-all duration-300 hover:max-w-full"
          }`}
        >
          <img className="h-4 w-4" alt="" src={item.icon} />
          <span
            className={`${pathname === item.link ? "" : "opacity-0"} transition-opacity duration-500 group-hover:opacity-100 group-hover:duration-200`}
          >
            {item.title}
          </span>
        </a>
      ))}
    </nav>
  );
}
