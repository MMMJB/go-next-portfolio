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
// import videoToCanvas from "@/utils/video";

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

const TWO_PI = 2 * Math.PI;
const SPRING_CONSTANT = 0.05;
const NUM_LINES = 20;
const PULL_THRESHOLD = 30;

export default function Simulation() {
  const {
    dimensions: { width: w, height: h },
    visitors: v,
  } = useVisitors();
  // const visitors = v.concat(v, v, v, v, v, v, v, v, v, v, v, v, v, v, v);
  const visitors: Visitor[] = [];

  const scene = useRef<HTMLCanvasElement | null>(null);
  const engine = useRef(Engine.create(engineOptions));
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

    World.add(engine.current.world, rectangles);
  }

  function removeBounds() {
    const bodiesToRemove = engine.current.world.bodies.filter(
      (b) => b.isStatic,
    );

    World.remove(engine.current.world, bodiesToRemove);
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

    return () => {
      World.clear(engine.current.world, true);
      Engine.clear(engine.current);

      removeBalls();
      removeBounds();
    };
  }, []);

  useEffect(() => {
    const stringsCanvas = document.getElementById(
      "strings",
    ) as HTMLCanvasElement;
    const { width, height, x, y } = stringsCanvas.getBoundingClientRect();

    const pixelRatio = window.devicePixelRatio;
    stringsCanvas.width = width * pixelRatio;
    stringsCanvas.height = height * pixelRatio;
    stringsCanvas.style.width = `${width}px`;
    stringsCanvas.style.height = `${height}px`;

    const ctx = stringsCanvas.getContext("2d")!;
    const sw = stringsCanvas.width,
      sh = stringsCanvas.height;

    let frameId: number,
      lastTime = 0,
      lastMouseCheck = 0;

    const lines: {
      py: number;
      vy: number;
      dragging: boolean;
      direction: number;
      prevDistance: number;
      baseY: number;
    }[] = [];
    for (let i = 0; i < NUM_LINES; i++) {
      const baseY = sh / NUM_LINES / 2 + (sh / NUM_LINES) * i;

      lines.push({
        py: baseY,
        vy: 0,
        dragging: false,
        direction: 1,
        prevDistance: 0,
        baseY,
      });
    }

    ctx.strokeStyle = "red";

    // const videoFrame = videoToCanvas("/waves.mp4", stringsCanvas);

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

      // <--- Custom rendering --->

      // ctx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, sw, sh);

      const mouseX = (mouse.current.x - x) * pixelRatio;
      const mouseY = (mouse.current.y - y) * pixelRatio;

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 5, 0, TWO_PI);
      ctx.stroke();

      for (let i = 0; i < NUM_LINES; i++) {
        const l = lines[i];

        const mouseDistanceToCenter = mouseY - l.baseY;
        const withinXRange = mouseX > 0 && mouseX < sw;

        if (
          !l.dragging &&
          Math.abs(mouseDistanceToCenter) < PULL_THRESHOLD &&
          withinXRange
        ) {
          l.direction = l.prevDistance < mouseDistanceToCenter ? 1 : -1;
          l.dragging = true;
        } else if (
          l.dragging &&
          (Math.abs(mouseDistanceToCenter) > PULL_THRESHOLD || !withinXRange)
        ) {
          l.dragging = false;

          l.py = l.baseY + mouseDistanceToCenter;
        }

        l.py += l.vy;

        ctx.moveTo(0, l.baseY);
        ctx.beginPath();
        ctx.bezierCurveTo(
          0,
          l.baseY,
          mouseX,
          l.dragging ? mouseY + PULL_THRESHOLD * l.direction : l.py,
          sw,
          l.baseY,
        );
        ctx.stroke();

        l.prevDistance = mouseDistanceToCenter;

        l.vy += (l.baseY - l.py) * SPRING_CONSTANT - l.vy * 0.01;
      }

      // ctx.globalCompositeOperation = "source-atop";

      // videoFrame();
    })();

    return () => window.cancelAnimationFrame(frameId);
  }, [w, h]);

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
