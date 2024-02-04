"use client";

import { useState, useEffect } from "react";

import Grid from "@/components/Grid";

export default function Home() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  function handleResize() {
    setWidth(Math.min(window.innerWidth, 600));
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative mx-auto h-full w-full max-w-[600px] flex-col justify-center py-16">
      <Grid points={[]} width={width} height={height} size={25} />
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
