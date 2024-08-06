"use client";

import { useRef, useState, useEffect } from "react";
import { useVisitors } from "@/contexts/visitorContext";
import Matter, {
  Bodies,
  Body,
  // Bounds,
  Composites,
  Composite,
  Constraint,
  Engine,
  Query,
  Render,
  // Runner,
  World,
} from "matter-js";

import Comment from "./Comment";

import clamp from "@/utils/clamp";
import renderWorld from "@/utils/render";

const engineOptions = {
  enableSleeping: true,
  positionIterations: 6,
  velocityIterations: 4,
  constraintIterations: 2,
  broadphase: {
    detector: Matter.Detector.collisions,
    buckets: {
      width: 50,
      height: 50,
    },
  },
};

Matter.use("matter-springs");

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
    visitors: v,
  } = useVisitors();
  const visitors = v.concat(v, v, v, v, v, v, v, v, v, v, v, v, v, v, v);

  const scene = useRef<HTMLCanvasElement | null>(null);
  const engine = useRef(Engine.create(engineOptions));
  const render = useRef<Render | null>(null);
  const balls = useRef<Composite | null>(null);
  const display = useRef<Composite | null>(null);
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
    const rectangles = Object.values(collidableElements).map((el) => {
      const { x, y, width, height } = el.getBoundingClientRect();

      // ! Inconsistent with slide-in animations
      return Bodies.rectangle(
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
    });

    const displayContainer = document.getElementById("display-container")!;
    const { x, y, width, height } = displayContainer.getBoundingClientRect();

    display.current = Composites.stack(
      x,
      y,
      4,
      1,
      12,
      0,
      (x: number, y: number) =>
        Bodies.rectangle(x, y + window.scrollY, (width - 36) / 4, height, {
          isStatic: true,
          render: {
            fillStyle: "blue",
          },
        }),
    );

    World.add(engine.current.world, rectangles);
    Composite.add(engine.current.world, display.current);
  }

  function removeBounds() {
    const bodiesToRemove = engine.current.world.bodies.filter(
      (b) => b.isStatic,
    );

    World.remove(engine.current.world, bodiesToRemove);

    if (display.current) Composite.clear(display.current, false);
  }

  useEffect(() => {
    if (!scene.current) return;

    render.current = Render.create({
      engine: engine.current,
      canvas: scene.current,
      options: {
        width: w,
        height: h,
        wireframes: true,
        background: "transparent",
        showSleeping: true,
      },
    });

    render.current.textures = visitors.reduce(
      (a, c) => ((a[c.avatar] = c.avatarImage!), a),
      {} as Record<string, HTMLImageElement>,
    );

    // Runner.run(engine.current);

    let frameId: number,
      lastTime = 0,
      lastMouseCheck = 0;

    (function renderFrame() {
      frameId = window.requestAnimationFrame(renderFrame);

      const now = Date.now();
      const delta = now - (lastTime || now);
      lastTime = now;

      Engine.update(engine.current, delta);

      // Render.world(render.current!);
      renderWorld(render.current);

      if (now - lastMouseCheck > 10) {
        afterEngineUpdate();
        lastMouseCheck = now;
      }
    })();

    return () => {
      World.clear(engine.current.world, true);
      Engine.clear(engine.current);

      window.cancelAnimationFrame(frameId);

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
  }, [w, h]);

  function afterEngineUpdate() {
    if (!balls.current || hovered) return;

    const bodies = Composite.allBodies(balls.current);
    const collisions = Query.point(bodies, mouse.current).filter(
      (body) => parseInt(body.label) < visitors.length,
    );

    setHovered(collisions[0] || null);
  }

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
    mouse.current.y = e.clientY + window.scrollY;
  }

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <canvas
        ref={scene}
        className="pointer-events-none absolute inset-0 -z-10"
        width={w}
        height={h}
      />
      {hovered && (
        <Comment
          author={visitors[parseInt(hovered.label)].name}
          index={parseInt(hovered.label) + 1}
          position={mouse.current}
        >
          {visitors[parseInt(hovered.label)].message}
        </Comment>
      )}
    </>
  );
}
