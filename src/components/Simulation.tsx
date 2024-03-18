"use client";

import { useRef, useEffect } from "react";
import { useGrid } from "@/contexts/gridContext";
import { Engine, Render, World, Bodies, Runner } from "matter-js";

import getTheme from "@/utils/getTheme";

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
  } = useGrid();

  const scene = useRef<HTMLCanvasElement | null>(null);
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>();

  function addBounds() {
    if (!w || !h) return;

    const left = Bodies.rectangle(-10, h / 2, 20, h, { isStatic: true });
    const right = Bodies.rectangle(w + 10, h / 2, 20, h, { isStatic: true });
    const floor = Bodies.rectangle(w / 2, h + 10, w, 20, { isStatic: true });
    const ceiling = Bodies.rectangle(w / 2, -20, w, 20, { isStatic: true });

    World.add(engine.current.world, [left, right, floor, ceiling]);

    if (w < 600 || h < 600) return;

    const collidableElements = document.querySelectorAll(".collision");
    collidableElements.forEach((el) => {
      const { x, y, width, height } = el.getBoundingClientRect();
      const body = Bodies.rectangle(
        x - 4 + width / 2,
        y - 8 + height / 2,
        width,
        height,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
          },
        },
      );

      World.add(engine.current.world, [body]);
    });
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
        // showBounds: true,
        background: "transparent",
      },
    });

    Runner.run(engine.current);
    Render.run(render.current);

    return () => {
      Render.stop(render.current!);
      World.clear(engine.current.world, true);
      Engine.clear(engine.current);
      render.current!.canvas.remove();
      render.current!.textures = {};
      removeBounds();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("click", onMouseClick);

    return () => {
      window.removeEventListener("click", onMouseClick);
    };
  }, [w, h, onMouseClick]);

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
      Bodies.circle(x, y, (w > 600 ? 20 : 5) + Math.random() * 20, {
        restitution: 0.6,
        mass: 25,
        friction: 0.001,
        render: {
          fillStyle:
            getTheme() === "dark"
              ? `hsl(231, 24%, ${30 + Math.random() * 15}%)`
              : `hsl(0, 0%, ${90 - Math.random() * 15}%)`,
        },
        label: "ball",
      }),
    ]);
  }

  return (
    <canvas
      ref={scene}
      className="absolute inset-0 -z-50 !h-full !w-screen"
      width={w}
      height={h}
    />
  );
}
