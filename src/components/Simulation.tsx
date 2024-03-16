"use client";

import { useRef, useEffect } from "react";
import { useGrid } from "@/contexts/gridContext";
import { Engine, Render, World, Bodies, Runner } from "matter-js";

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
  } = useGrid();

  const scene = useRef<HTMLDivElement | null>(null);
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>();

  useEffect(() => {
    if (!scene.current) return;

    render.current = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: "transparent",
      },
    });

    World.add(engine.current.world, [
      Bodies.rectangle(w / 2, -10, w, 20, { isStatic: true }),
      Bodies.rectangle(-10, h / 2, 20, h, { isStatic: true }),
      Bodies.rectangle(w / 2, h + 10, w, 20, { isStatic: true }),
      Bodies.rectangle(w + 10, h / 2, 20, h, { isStatic: true }),
    ]);

    Runner.run(engine.current);
    Render.run(render.current);

    window.addEventListener("click", onMouseClick);

    return () => {
      Render.stop(render.current!);
      World.clear(engine.current.world, true);
      Engine.clear(engine.current);
      render.current!.canvas.remove();
      render.current!.textures = {};
    };
  }, []);

  useEffect(() => {
    if (!render.current || !w || !h) return;

    render.current.bounds.max.x = w;
    render.current.bounds.max.y = h;
    render.current.options.width = w;
    render.current.options.height = h;
    render.current.canvas.width = w;
    render.current.canvas.height = h;
    Render.setPixelRatio(render.current, window.devicePixelRatio);
  }, [w, h]);

  function onMouseClick(e: MouseEvent) {
    const { clientX, clientY } = e;
    const { left, top } = scene.current!.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;

    World.add(engine.current.world, [
      Bodies.circle(x, y, 20 + Math.random() * 20, {
        restitution: 0.5,
        mass: 25,
        friction: 0.001,
        render: {
          fillStyle: "red",
        },
      }),
    ]);
  }

  return <div ref={scene} className="absolute inset-0 -z-50" />;
}
