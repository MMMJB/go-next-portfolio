"use client";

import { useRef, useState, useEffect, useOptimistic } from "react";
import { useGrid } from "@/contexts/gridContext";

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

export default function Grid({ rows }: { rows: number }) {
  const {
    points,
    addPoint,
    removePoint,
    dimensions: { width, height },
  } = useGrid();

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [g, setGridDimensions] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);
  const [size, setSize] = useState(Math.ceil(height / rows));

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
    if (!g) return null;

    const x = e.clientX - g.left;
    const y = e.clientY - g.top;

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
    if (!addPoint) return;

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

  // async function handleRightClick(e: MouseEvent) {
  //   e.preventDefault();

  //   const position = parseMouseEvent(e);
  //   if (!position || !points) return;

  //   const { x, y } = position;
  //   const point = {
  //     lat: Math.ceil(y / size) - 1,
  //     lng: Math.ceil(x / size) - 1,
  //     col: "black",
  //   };

  //   await removePoint(point);
  // }

  function updateGridDimensions() {
    if (!svgRef.current) return;

    const { width, height, left, top } = svgRef.current.getBoundingClientRect();
    setGridDimensions({ width, height, left, top });
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseClick);
    window.addEventListener("pointerup", handleMouseClick);
    // window.addEventListener("contextmenu", handleRightClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseClick);
      window.removeEventListener("pointerup", handleMouseClick);
      // window.removeEventListener("contextmenu", handleRightClick);
    };
  }, [width, height, g]);

  useEffect(() => {
    if (!svgRef.current) return;

    updateGridDimensions();

    window.addEventListener("resize", updateGridDimensions);

    return () => window.removeEventListener("resize", updateGridDimensions);
  }, [svgRef.current]);

  useEffect(() => {
    setSize(Math.ceil(height / rows));
  }, [height, rows]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-4 -z-50 cursor-crosshair rounded-lg border-b border-r border-gray-100 bg-white dark:bg-text-light"
      style={{
        backgroundSize: `${size}px ${size}px`,
        backgroundImage: `linear-gradient(to right, #cccccc55 1px, transparent 1px), linear-gradient(to bottom, #cccccc55 1px, transparent 1px)`,
      }}
    >
      {optimisticPoints &&
        size &&
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
              "#353A56",
          }}
          style={{
            stroke: "#aaaaaa55",
          }}
          size={size}
        />
      )}
    </svg>
  );
}
