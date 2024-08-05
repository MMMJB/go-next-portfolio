"use client";

import { useRef, useState, useEffect } from "react";
import { useVisitors } from "@/contexts/visitorContext";
import {
  Engine,
  Render,
  World,
  Bodies,
  Bounds,
  Body,
  Runner,
  Composites,
  Composite,
  Events,
  Query,
} from "matter-js";

import Comment from "./Comment";

import clamp from "@/utils/clamp";

// const numBalls = 100;
// const notes = Object.fromEntries(
//   Array.from({ length: Math.round(Math.random() * numBalls) }).map((_, i) => [
//     i,
//     `Note ${i}`,
//   ]),
// );

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
    visitors,
  } = useVisitors();

  const scene = useRef<HTMLCanvasElement | null>(null);
  const engine = useRef(Engine.create({ gravity: { y: 0.5 } }));
  const render = useRef<Render | null>(null);
  const balls = useRef<Composite | null>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [hovered, setHovered] = useState<Body | null>(null);

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

      // ! Inconsistent with slide-in animations
      const body = Bodies.rectangle(
        x + width / 2,
        y + height / 2 + window.scrollY,
        width,
        height,
        {
          isStatic: true,
          render: {
            fillStyle: "red",
          },
        },
      );

      World.add(engine.current.world, [body]);
    });

    const ropesContainer = document.getElementById("ropes-container")!;
    const { x, y, width, height } = ropesContainer.getBoundingClientRect();
    const body = Bodies.rectangle(
      x + width / 2,
      y + height / 2 + window.scrollY,
      width,
      height,
      {
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      },
    );

    World.add(engine.current.world, [body]);
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
        background: "transparent",
        hasBounds: true,
      },
      bounds: Bounds.create([
        { x: 0, y: 0 },
        { x: w, y: h },
      ]),
    });

    render.current.textures = visitors.reduce(
      (a, c) => ((a[c.avatar] = c.avatarImage!), a),
      {} as Record<string, HTMLImageElement>,
    );

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

    removeBounds();
    removeBalls();
    addBounds();
    addBalls();

    function afterEngineUpdate() {
      if (!balls.current) return;

      const mouseRelativeToViewport = {
        x: mouse.current.x,
        y: mouse.current.y + window.scrollY,
      };

      const bodies = Composite.allBodies(balls.current);
      const collisions = Query.point(bodies, mouseRelativeToViewport).filter(
        (body) => parseInt(body.label) < visitors.length,
      );

      setHovered(collisions[0] || null);
    }

    Events.on(engine.current, "afterUpdate", afterEngineUpdate);

    return () => Events.off(engine.current, "afterUpdate", afterEngineUpdate);
  }, [w, h]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  function addBalls() {
    if (!scene.current) return;

    const numBalls = visitors.length;

    const cols = Math.floor(Math.sqrt(numBalls));
    const rows = Math.floor(numBalls / cols);

    const colGap = w > 600 ? w / cols : 0;
    const rowGap = w > 600 ? h / rows : 0;

    balls.current = Composites.stack(
      w > 600 ? 40 : 4,
      h * -2,
      cols,
      rows,
      colGap,
      rowGap,
      (x: number, y: number, col: number, row: number) => {
        const index = col + row * cols;

        const cx = x + ((Math.random() * colGap) / 2 - colGap / 4);
        const cy = y + (Math.random() * rowGap - rowGap / 2);

        const size = (w > 600 ? 20 : 10) + Math.random() * 20;
        const mass = size * 0.05;

        return Bodies.circle(clamp(30, cx, w - 30), cy, size, {
          restitution: 0.6,
          mass,
          inverseMass: 1 / mass,
          friction: 0.001,
          render: {
            strokeStyle: `hsl(0, 0%, ${90 - Math.random() * 15}%)`,
            sprite: {
              texture: index < visitors.length ? visitors[index].avatar : "",
              xScale: (size / 100) * 2,
              yScale: (size / 100) * 2,
            },
          },
          label: index.toString(),
        });
      },
    );

    Composite.add(engine.current.world, balls.current);
  }

  function removeBalls() {
    if (!balls.current) return;
    Composite.clear(balls.current, false);
  }

  function onMouseMove(e: MouseEvent) {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  }

  return (
    <>
      <canvas
        ref={scene}
        className="pointer-events-none absolute inset-0 -z-10 bg-transparent"
        width={w}
        height={h}
      />
      {hovered && (
        <Comment
          author={visitors[parseInt(hovered.label)].name}
          index={parseInt(hovered.label) + 1}
          position={hovered.position}
        >
          {visitors[parseInt(hovered.label)].message}
        </Comment>
      )}
    </>
  );
}
