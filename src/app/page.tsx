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
        <h1 className="flex flex-col text-8xl">
          Michael
          <span className="flex items-stretch gap-4">
            <div aria-hidden className="w-full py-4 pr-4">
              <Window />
            </div>
            Beck
          </span>
        </h1>
        <div className="flex w-full items-stretch text-2xl">
          <span>UI</span>
          <div className="w-full px-8">
            <Window />
          </div>
          <span>Frontend</span>
          <div className="w-full px-8">
            <Window />
          </div>
          <span>UX</span>
        </div>
        <div className="mt-4 h-8">
          <Window />
        </div>
      </section>
      <section>
        {!loading && (
          <Grid
            addPoint={addPoint}
            removePoint={removePoint}
            points={points}
            width={width}
            height={240}
            size={24}
          />
        )}
      </section>
    </div>
  );
}
