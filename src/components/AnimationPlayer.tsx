"use client";

import { useState, useEffect, createContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";

export const AnimationContext = createContext<() => void>(() => {});

export default function AnimationPlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  gsap.registerPlugin(ScrollTrigger);

  const pathname = usePathname();
  const params = useSearchParams();

  const [v, refresh] = useState(0);

  useEffect(() => {
    if (params.get("p")) {
      Object.values(document.querySelectorAll("section")).forEach((section) => {
        gsap.to(section, { y: 0, opacity: 1 });
      });

      return;
    }

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
  }, [pathname, params, v]);

  return (
    <AnimationContext.Provider value={() => refresh((p) => ++p)}>
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
    </AnimationContext.Provider>
  );
}
