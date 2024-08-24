"use client";

import { useEffect } from "react";

import { ProjectLink } from "@/components/base/Link";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Timeline({
  segmentSize,
  progressList,
}: {
  segmentSize: number;
  progressList: { startProgress: number; duration: number; _id: string }[];
}) {
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    progressList.forEach(({ duration, _id }) => {
      gsap.to(`#${_id} > .preview`, {
        scrollTrigger: {
          trigger: `#${_id}`,
          start: "top 300px",
          end: `+=${duration * segmentSize}`,
          scrub: true,
        },
        top: "100%",
        ease: "none",
      });

      gsap.to(`#${_id} > .preview`, {
        scrollTrigger: {
          trigger: `#${_id}`,
          start: "top 300px",
          end: `+=${duration * segmentSize}`,
          toggleActions: "play reverse play reverse",
        },
        opacity: 1,
        right: -12,
        pointerEvents: "all",
        duration: 0.2,
      });
    });
  }, []);

  return (
    <div className="relative flex h-full w-max gap-1.5">
      {progressList.map(({ startProgress, duration, _id }, i) => (
        <div
          key={_id}
          id={_id}
          className="relative w-6"
          style={{
            top: `${startProgress * segmentSize}px`,
            height: `${duration * segmentSize}px`,
            background: `hsl(${250 - i * 3}, 100%, 60%)`,
            zIndex: progressList.length - i,
          }}
        >
          <ProjectLink
            id={_id}
            className="preview pointer-events-none absolute right-0 top-0 -translate-y-1/2 translate-x-full rounded-3xl bg-white p-1.5 opacity-0 shadow-project-light"
          >
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-8 border-transparent border-r-white" />
            <img
              width="233"
              height="149"
              style={{
                minWidth: "233px",
                height: "149px",
              }}
              src={`/projects/${_id}/_thumbnail.png`}
              alt=""
              className="rounded-[18px]"
            />
          </ProjectLink>
        </div>
      ))}
    </div>
  );
}
