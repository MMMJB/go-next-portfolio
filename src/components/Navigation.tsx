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
      className="flex w-full flex-col gap-12 rounded border border-text-light/10 bg-card-light/5 p-3 backdrop-blur-lg transition-colors hover:bg-card-light/10 dark:border-card-dark/15 dark:bg-card-dark/5 dark:hover:bg-card-dark/10"
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
    <div className="flex flex-col gap-3">
      <nav className="grid w-full grid-cols-2 gap-3 sm:flex">
        {navItems.map((item) => (
          <NavigationCard key={item.title} {...item} />
        ))}
      </nav>
    </div>
  );
}
