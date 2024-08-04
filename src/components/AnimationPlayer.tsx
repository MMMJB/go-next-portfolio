"use client";

import { useEffect } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function AnimationPlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const ctx = gsap.context(() => {
      (gsap.utils.toArray("section") as HTMLDivElement[]).forEach((section) => {
        gsap.to(section, {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
