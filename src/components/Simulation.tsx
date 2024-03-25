"use client";

import { useRef, useEffect } from "react";
import { useGrid } from "@/contexts/gridContext";
import {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Runner,
  Composites,
  Composite,
  Mouse,
  MouseConstraint,
  Events,
  Query,
} from "matter-js";

import getTheme from "@/utils/getTheme";

const numBalls = 100;

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
  } = useGrid();

  const scene = useRef<HTMLCanvasElement | null>(null);
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>(null);
  const balls = useRef<Composite | null>(null);
  const mouse = useRef<Mouse | null>(null);
  const mouseConstraint = useRef<MouseConstraint | null>(null);
  const hovered = useRef<Body | null>(null);

  function addBounds() {
    if (!w || !h) return;

    const left = Bodies.rectangle(-10, h / 2, 20, h, { isStatic: true });
    const right = Bodies.rectangle(w + 10, h / 2, 20, h, { isStatic: true });
    const floor = Bodies.rectangle(w / 2, h + 10, w, 20, { isStatic: true });
    // const ceiling = Bodies.rectangle(w / 2, -20, w, 20, { isStatic: true });

    World.add(engine.current.world, [left, right, floor /*, ceiling*/]);

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

      removeBalls();
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

    const observer = new MutationObserver(() => {
      removeBalls();
      addBalls();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      childList: false,
      characterData: false,
    });

    removeBounds();
    removeBalls();
    removeMouse();
    addBounds();
    addBalls();
    addMouse();

    function afterEngineUpdate() {
      if (!mouse.current || !mouseConstraint.current || !balls.current) return;

      const bodies = Composite.allBodies(balls.current);
      const collisions = Query.point(bodies, mouse.current.position);

      hovered.current = collisions[0] || null;
    }

    function afterRender() {
      if (!render.current || !hovered.current) return;

      const ctx = render.current.context;
      const { x, y } = hovered.current.position;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fill();
      ctx.closePath();
    }

    Events.on(engine.current, "afterUpdate", afterEngineUpdate);
    Events.on(render.current, "afterRender", afterRender);

    return () => {
      observer.disconnect();
      Events.off(engine.current, "afterUpdate", afterEngineUpdate);
      Events.off(render.current, "afterRender", afterRender);
    };
  }, [w, h]);

  function addBalls() {
    if (!scene.current) return;

    const cols = Math.ceil(Math.sqrt(numBalls));
    const rows = Math.ceil(numBalls / cols);

    const colGap = w > 600 ? w / cols : 0;
    const rowGap = w > 600 ? h / rows : 0;

    balls.current = Composites.stack(
      20,
      h * -2,
      cols,
      rows,
      colGap,
      rowGap,
      (x: number, y: number, col: number, row: number) => {
        const index = col + row * cols;

        const cx = x + (Math.random() * colGap - colGap / 2);
        const cy = y + (Math.random() * rowGap - rowGap / 2);

        const size = (w > 600 ? 20 : 2) + Math.random() * 20;
        const mass = size * 0.75;

        return Bodies.circle(cx, cy, size, {
          restitution: 0.6,
          mass,
          friction: 0.001,
          render: {
            fillStyle:
              getTheme() === "dark"
                ? index === 0
                  ? "white"
                  : `hsl(231, 24%, ${30 + Math.random() * 15}%)`
                : index === 0
                  ? "#6790E0"
                  : `hsl(0, 0%, ${90 - Math.random() * 15}%)`,
          },
          label: "ball",
        });
      },
    );

    Composite.add(engine.current.world, balls.current);
  }

  function removeBalls() {
    if (!balls.current) return;
    Composite.clear(balls.current, false);
  }

  function addMouse() {
    if (!render.current) return;

    mouse.current = Mouse.create(render.current.canvas);
    mouseConstraint.current = MouseConstraint.create(engine.current);

    Composite.add(engine.current.world, mouseConstraint.current);

    render.current!.mouse = mouse.current;
  }

  function removeMouse() {
    if (!mouseConstraint.current) return;
    Composite.remove(engine.current.world, mouseConstraint.current);
  }

  return (
    <canvas
      ref={scene}
      className="absolute inset-0 z-0 !h-full !w-screen"
      width={w}
      height={h}
    />
  );
}
