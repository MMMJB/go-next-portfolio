"use client";

import { useState, useEffect } from "react";

import Grid from "@/components/Grid";
import Navigation from "@/components/Navigation";

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
    <div className="flex w-full max-w-[600px] flex-col gap-8 p-8 sm:gap-24 sm:p-0">
      <div className="flex w-full gap-24">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Hey, I&apos;m Michael! 👋</h1>
          <p className="text-justify text-sm">
            I’m a 16-year-old experienced in fullstack engineering and UI/UX
            design. I&apos;m the founder of{" "}
            <a href="https://launchsite.tech">Launch</a> and a frontend
            developer at a <a href="/projects">few other projects</a>. If you
            have any questions, feel free to <a href="/contact">contact me</a>.
          </p>
        </div>
        <div className="hidden w-full items-end justify-center sm:flex">
          <img src="/hoops.png" alt="" />
        </div>
      </div>
      <Navigation />
    </div>
  );
}
