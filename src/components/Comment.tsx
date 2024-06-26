"use client";

import { useState, useEffect } from "react";
import { useVisitors } from "@/contexts/visitorContext";

export default function Comment({
  children,
  author,
  index,
  position,
}: {
  children: React.ReactNode;
  index: number;
  author: string;
  position: { x: number; y: number };
}) {
  const {
    dimensions: { width: w, height: h },
  } = useVisitors();

  const [mouse, setMouse] = useState(position);

  const orientationX = position.x > w / 2 ? "right" : "left";

  function onMouseMove(e: MouseEvent) {
    setMouse({ x: e.clientX, y: e.clientY });
  }

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      style={{
        left: `${mouse.x}px`,
        top: `${mouse.y}px`,
        transform: `translate(
          ${orientationX === "right" ? "-100%" : "0"},
          -100%
        )`,
      }}
      className={`absolute hidden w-max min-w-64 max-w-80 flex-col gap-3 rounded-xl border border-card-light-border bg-card-light p-3 dark:border-card-dark-border dark:bg-card-dark sm:flex ${
        orientationX === "right" ? "rounded-br-sm" : "rounded-bl-sm"
      }`}
    >
      <div className="flex w-full items-center justify-between text-xs">
        <span className="text-text-light/75 dark:text-text-dark/75">
          {author}
        </span>
        <span className="number text-text-light/25 dark:text-text-dark/25">
          {index}
        </span>
      </div>
      <p className="text-sm">{children}</p>
    </div>
  );
}
