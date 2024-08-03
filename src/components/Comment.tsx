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
    >
      Comment
    </div>
  );
}
