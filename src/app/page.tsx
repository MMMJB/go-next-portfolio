"use client";

import { useState, useEffect } from "react";

import Grid from "@/components/Grid";

import { fetchAllPoints, createPoint, deletePoint } from "./actions";

export default function Home() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);

  function handleResize() {
    setWidth(Math.min(window.innerWidth, 600));
    setHeight(window.innerHeight);
  }

  async function onPageLoad() {
    const data = await fetchAllPoints();

    setPoints(data);
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
    <div className="relative mx-auto h-full w-full max-w-[600px] flex-col justify-center py-16">
      {!loading && (
        <Grid
          addPoint={addPoint}
          removePoint={removePoint}
          points={points}
          width={width}
          height={height}
          size={25}
        />
      )}
      <section className="font-akira flex w-max flex-col gap-4">
        <h1 className="text-right text-8xl">
          Michael
          <br />
          Beck
        </h1>
        <div className="flex w-full justify-between text-2xl">
          <span>UI</span>
          <span>Frontend</span>
          <span>UX</span>
        </div>
      </section>
    </div>
  );
}
