"use client";

import { useRef, useEffect } from "react";
import { useGrid } from "@/contexts/gridContext";
import { Engine, Render, World, Body, Bodies, Runner } from "matter-js";

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
  } = useGrid();

  const scene = useRef<HTMLCanvasElement | null>(null);
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>();

  function addBounds() {
    if (!w || !h) return;

    const leftBound = Bodies.rectangle(-10, h / 2, 20, h, { isStatic: true });
    const rightBound = Bodies.rectangle(w + 10, h / 2, 20, h, {
      isStatic: true,
    });
    const floor = Bodies.rectangle(w / 2, h + 10, w, 20, { isStatic: true });

    World.add(engine.current.world, [leftBound, rightBound, floor]);
  }

  function removeBounds() {
    World.remove(engine.current.world, [
      ...engine.current.world.bodies.filter((b) => b.isStatic),
    ]);
  }

  useEffect(() => {
    if (!scene.current) return;

    render.current = Render.create({
      engine: engine.current,
      canvas: scene.current,
      options: {
        width: w,
        height: h,
        wireframes: false,
        showIds: true,
        showBounds: true,
        background: "transparent",
      },
    });

    Runner.run(engine.current);
    Render.run(render.current);

    window.addEventListener("click", onMouseClick);

    return () => {
      Render.stop(render.current!);
      World.clear(engine.current.world, true);
      Engine.clear(engine.current);
      render.current!.canvas.remove();
      render.current!.textures = {};
      window.removeEventListener("click", onMouseClick);
      removeBounds();
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

    removeBounds();
    addBounds();
  }, [w, h]);

  function onMouseClick(e: MouseEvent) {
    if (!scene.current) return;

    const { clientX, clientY } = e;
    const { left, top } = scene.current.getBoundingClientRect();

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

  return (
    <canvas
      ref={scene}
      className="absolute inset-0 -z-50 !h-screen !w-screen"
    />
  );
}
