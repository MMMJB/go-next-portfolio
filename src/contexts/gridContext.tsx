"use client";

import { useState, useEffect, useContext, createContext } from "react";

import { fetchAllPoints, createPoint, deletePoint } from "@/app/actions";

const GridContext = createContext<{
  dimensions: {
    width: number;
    height: number;
  };
  loading: boolean;
  points: Point[];
  addPoint: ((newPoint: Point) => Promise<void>) | null;
  removePoint: ((point: Point) => Promise<void>) | null;
}>({
  dimensions: {
    width: 0,
    height: 0,
  },
  loading: true,
  points: [],
  addPoint: null,
  removePoint: null,
});

export function useGrid() {
  return useContext(GridContext);
}

export function GridProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setDimensions({
      width: window.innerWidth - 16,
      height: window.innerHeight - 16,
    });
  }

  async function onPageLoad() {
    const data = await fetchAllPoints();

    setPoints(data || []);
    setLoading(false);
  }

  useEffect(() => {
    handleResize();
    onPageLoad();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function addPoint(newPoint: Point) {
    await createPoint(newPoint);

    setPoints((points) => [...points, newPoint]);
  }

  async function removePoint(point: Point) {
    await deletePoint(point);

    setPoints((points) =>
      points.filter((p) => !(p.lat === point.lat && p.lng === point.lng)),
    );
  }

  return (
    <GridContext.Provider
      value={{ dimensions, loading, points, addPoint, removePoint }}
    >
      {children}
    </GridContext.Provider>
  );
}
