"use client";

import { useState, useEffect, useOptimistic } from "react";

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
  startingPoints,
  width,
  height,
  size,
}: {
  startingPoints: Point[];
  width: number;
  height: number;
  size: number;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [points, addPoint] = useOptimistic<Point[], Point>(
    startingPoints,
    (state, newPoint) => [
      ...state,
      {
        ...newPoint,
        updating: true,
      },
    ],
  );

  function parseMouseEvent(e: MouseEvent | PointerEvent) {
    return {
      x: e.clientX - (window.innerWidth - width) / 2,
      y: e.clientY,
    };
  }

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();

    setMousePosition(parseMouseEvent(e));
  }

  async function handleMouseClick(e: MouseEvent | PointerEvent) {
    e.preventDefault();

    const { x, y } = parseMouseEvent(e);
    const newPoint = {
      lat: Math.ceil(y / size) - 1,
      lng: Math.ceil(x / size) - 1,
      col: "black",
    };

    console.log("Updating points...");

    addPoint(newPoint);

    await fetch(
      `/api/newPoint?lat=${newPoint.lat}&lng=${newPoint.lng}&col=${newPoint.col}`,
    );

    console.log("Points updated");
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseClick);
    window.addEventListener("pointerdown", handleMouseClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseClick);
      window.removeEventListener("pointerdown", handleMouseClick);
    };
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
