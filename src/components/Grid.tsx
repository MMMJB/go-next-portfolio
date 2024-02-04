"use client";

import { useState, useEffect } from "react";

function Point({
  p,
  size,
  stroke,
}: {
  p: Point;
  size: number;
  stroke?: string;
}) {
  return (
    <rect
      x={p.lng * size}
      y={p.lat * size}
      width={size}
      height={size}
      fill={p.col}
      stroke={stroke}
      rx="2"
    />
  );
}

export default function Grid({
  points,
  width,
  height,
  size,
}: {
  points: Point[];
  width: number;
  height: number;
  size: number;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();

    const x = e.clientX - (window.innerWidth - width) / 2;
    const y = e.clientY;

    setMousePosition({ x, y });
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [width, height]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 -z-10">
      {points.map((point, i) => (
        <Point key={i} p={point} size={size} />
      ))}
      <Point
        key="mouse"
        p={{
          lat: Math.ceil(mousePosition.y / size) - 1,
          lng: Math.ceil(mousePosition.x / size) - 1,
          col: "transparent",
        }}
        stroke="#aaa"
        size={size}
      />
    </svg>
  );
}
