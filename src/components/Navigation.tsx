"use client";

import { useState, useEffect } from "react";

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
      className="border-card-light-border hover:bg-card-light-hover dark:border-card-dark-border dark:hover:bg-card-dark-hover flex w-full flex-col gap-12 rounded border bg-card-light p-3 transition-colors dark:bg-card-dark"
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
        <span className="text-xs">{description}</span>
      </div>
    </a>
  );
}

export default function Nav() {
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
