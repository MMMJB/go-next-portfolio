"use client";

import { useState, useEffect } from "react";

import Image from "next/image";

export default function Gallery({
  slug,
  assets,
}: {
  slug: string;
  assets: Project["gallery"];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % assets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border">
      <div role="marquee" className="flex overflow-hidden bg-surface">
        <div
          role="scroll"
          className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-2 overflow-hidden rounded-full bg-white px-3 py-2 shadow-project-dark"
        >
          {assets.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-3 w-3 rounded-full ${i === index ? "bg-text-light" : "bg-border"}`}
            />
          ))}
        </div>
        {assets.map((asset, i) => (
          <Image
            key={i}
            src={asset.src}
            alt=""
            width={1280}
            height={628}
            className="transform transition-transform duration-300"
            style={{
              transform: `translateX(${index * -100}%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
