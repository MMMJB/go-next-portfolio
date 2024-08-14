"use client";

import { useState } from "react";

import Image from "next/image";

export default function Gallery({
  slug,
  assets,
}: {
  slug: string;
  assets: string[];
}) {
  const [index, setIndex] = useState(0);

  return (
    <div className="w-full overflow-hidden rounded-3xl">
      <div role="marquee" className="flex overflow-hidden bg-surface">
        <div
          role="scroll"
          className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full bg-white px-3 py-2 shadow-project-dark"
        >
          {assets.map((asset, i) => (
            <button
              key={asset}
              onClick={() => setIndex(i)}
              className={`h-3 w-3 rounded-full ${i === index ? "bg-text-light" : "bg-border"}`}
            />
          ))}
        </div>
        {assets.map((asset, i) => (
          <Image
            key={i}
            src={`/projects/${slug}/${asset}`}
            alt=""
            width={1280}
            height={628}
            placeholder="blur"
            className={`transform transition-transform duration-300 ${
              i === index ? "translate-x-0" : "translate-x-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
