"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

import { X } from "react-feather";
import Project from "./Project";
import Link from "./base/Link";

import gsap from "gsap";

export default function ProjectDisplay() {
  const params = useSearchParams();
  const pathname = usePathname();

  const hidden = !params.get("p");

  function onOpen() {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    document.body.setAttribute("data-lenis-prevent", "true");
    document.body.style.setProperty("overflow", "hidden");

    gsap.to("#project-popup", {
      background: "rgba(0, 0, 0, 0.8)",
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to("#project-popup > *", {
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  function onClose() {
    document.body.removeAttribute("data-lenis-prevent");
    document.body.style.removeProperty("overflow");
  }

  useEffect(() => {
    if (!params.get("p")) return;

    onOpen();
  }, [params]);

  return hidden ? null : (
    <div
      id="project-popup"
      className="fixed inset-0 z-50 flex h-full w-full flex-col gap-5 overflow-y-auto bg-transparent pt-5"
    >
      <Link
        onClick={onClose}
        href={pathname}
        className="ml-auto mr-5 translate-y-20"
      >
        <button className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-text-dark">
          <X />
        </button>
      </Link>
      <div className="w-full translate-y-20 rounded-tl-4xl bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-[120px] pb-10 pt-20">
          <Project slug={params.get("p") || ""} />
        </div>
      </div>
    </div>
  );
}
