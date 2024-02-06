"use client";

import { useState, useEffect, useOptimistic } from "react";

type GridPoint = Point & { updating?: boolean };

function Point({
  p,
  size,
  style,
}: {
  p: Point;
  size: number;
  style?: React.CSSProperties;
}) {
  return (
    <rect
      x={p.lng * size}
      y={p.lat * size}
      width={size}
      height={size}
      fill={p.col}
      style={style}
      rx="2"
    />
  );
}

export default function Grid({
  points,
  addPoint,
  width,
  height,
  size,
}: {
  points: Point[];
  addPoint: (newPoint: Point) => Promise<void>;
  width: number;
  height: number;
  size: number;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [optimisticPoints, addOptimisticPoint] = useOptimistic<
    GridPoint[],
    Point
  >(points, (state, newPoint) => [...state, { ...newPoint, updating: true }]);

  function parseMouseEvent(e: MouseEvent, width: number) {
    return {
      x: e.clientX - (window.innerWidth - width) / 2,
      y: e.clientY,
    };
  }

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();

    setMousePosition(parseMouseEvent(e, width));
  }

  async function handleMouseClick(e: MouseEvent) {
    e.preventDefault();

    const { x, y } = parseMouseEvent(e, width);
    const newPoint = {
      lat: Math.ceil(y / size) - 1,
      lng: Math.ceil(x / size) - 1,
      col: "black",
    };

    addOptimisticPoint(newPoint);

    await addPoint(newPoint);
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
      {optimisticPoints.map((point, i) => (
        <Point
          key={i}
          p={point}
          size={size}
          style={{
            opacity: point.updating ? 0.5 : 1,
          }}
        />
      ))}
      <Point
        key="mouse"
        p={{
          lat: Math.ceil(mousePosition.y / size) - 1,
          lng: Math.ceil(mousePosition.x / size) - 1,
          col: "transparent",
        }}
        style={{
          stroke: "#aaa",
        }}
        size={size}
      />
    </svg>
  );
}
