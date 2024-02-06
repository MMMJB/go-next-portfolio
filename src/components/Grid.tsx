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
  removePoint,
  width,
  height,
  size,
}: {
  points: Point[];
  addPoint: (newPoint: Point) => Promise<void>;
  removePoint: (point: Point) => Promise<void>;
  width: number;
  height: number;
  size: number;
}) {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [optimisticPoints, addOptimisticPoint] = useOptimistic<
    GridPoint[],
    Point
  >(points, (state, newPoint) => [...state, { ...newPoint, updating: true }]);

  function findPointAtLocation(lat: number, lng: number) {
    return (
      optimisticPoints &&
      optimisticPoints.find((p) => p.lat === lat && p.lng === lng)
    );
  }

  function parseMouseEvent(e: MouseEvent) {
    const x = e.clientX - (window.innerWidth - width) / 2;
    const y = e.clientY;

    if (x <= 0 || x > width || y <= 0 || y > height) return null;

    return { x, y };
  }

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();

    const position = parseMouseEvent(e);
    if (!position) return setMousePosition(null);

    const { x, y } = position;
    setMousePosition(() => ({
      x: Math.ceil(x / size) - 1,
      y: Math.ceil(y / size) - 1,
    }));
  }

  async function handleMouseClick(e: MouseEvent) {
    e.preventDefault();

    const position = parseMouseEvent(e);
    if (!position) return;

    const { x, y } = position;
    const newPoint = {
      lat: Math.ceil(y / size) - 1,
      lng: Math.ceil(x / size) - 1,
      col: "black",
    };

    addOptimisticPoint(newPoint);

    await addPoint(newPoint);
  }

  async function handleRightClick(e: MouseEvent) {
    e.preventDefault();

    const position = parseMouseEvent(e);
    if (!position) return;

    const { x, y } = position;
    const point = {
      lat: Math.ceil(y / size) - 1,
      lng: Math.ceil(x / size) - 1,
      col: "black",
    };

    await removePoint(point);
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    // window.addEventListener("mouseup", handleMouseClick);
    // window.addEventListener("pointerup", handleMouseClick);
    window.addEventListener("contextmenu", handleRightClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // window.removeEventListener("mouseup", handleMouseClick);
      // window.removeEventListener("pointerup", handleMouseClick);
      window.removeEventListener("contextmenu", handleRightClick);
    };
  }, [width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 -z-10 border-r border-gray-300 bg-white"
      style={{
        backgroundSize: `${size}px ${size}px`,
        backgroundImage: `linear-gradient(to right, #cccccc33 1px, transparent 1px), linear-gradient(to bottom, #cccccc33 1px, transparent 1px)`,
      }}
    >
      {optimisticPoints &&
        optimisticPoints.map((point, i) => (
          <Point
            key={i}
            p={point}
            size={size}
            style={{
              opacity: point.updating ? 0.5 : 1,
            }}
          />
        ))}
      {mousePosition && (
        <Point
          key="mouse"
          p={{
            lat: mousePosition.y,
            lng: mousePosition.x,
            col:
              findPointAtLocation(mousePosition.y, mousePosition.x)?.col ||
              "white",
          }}
          style={{
            stroke: "#aaaaaa33",
          }}
          size={size}
        />
      )}
    </svg>
  );
}
