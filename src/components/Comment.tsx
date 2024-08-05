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
    dimensions: { width: w },
  } = useVisitors();

  const [mouse, setMouse] = useState({
    x: position.x,
    y: position.y - window.scrollY,
  });

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
        top: `${mouse.y + window.scrollY}px`,
        transform: `translate(
          ${orientationX === "right" ? "-100%" : "0"},
          -100%
        )`,
      }}
      className={`${orientationX === "right" ? "rounded-br-sm" : "rounded-bl-sm"} absolute min-w-min max-w-80 rounded-2xl bg-white px-3 py-2 shadow-project-dark`}
    >
      <div className="span mb-2 flex items-center justify-between gap-2 rounded-t-md text-text-light/75">
        <span>{author}</span>
        <span>#{index}</span>
      </div>
      <p className="p text-text-dark">{children}</p>
    </div>
  );
}
