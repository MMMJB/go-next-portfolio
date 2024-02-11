"use client";

import { useState, useEffect } from "react";

import Grid from "@/components/Grid";
import Window from "@/components/Window";

import { fetchAllPoints, createPoint, deletePoint } from "./actions";

export default function Home() {
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);

  function handleResize() {
    setWidth(Math.min(window.innerWidth, 768));
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
    <div className="relative mx-auto flex h-full w-full max-w-screen-md flex-col justify-center gap-16 bg-white py-16">
      <section className="font-akira mx-auto flex w-max flex-col gap-4">
        <h1 className="text-right text-8xl">
          Michael
          <br />
          Beck
        </h1>
        <div className="flex w-full items-center justify-between text-2xl">
          <span>UI</span>
          <span>Frontend</span>
          <span>UX</span>
        </div>
      </section>
      <section>
        {!loading && (
          <Grid
            addPoint={addPoint}
            removePoint={removePoint}
            points={points}
            width={width}
            height={216}
            size={24}
          />
        )}
      </section>
    </div>
  );
}
