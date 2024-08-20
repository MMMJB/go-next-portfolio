"use client";

import { useState, useCallback } from "react";

import Link, { ProjectLink } from "./base/Link";
import MatchedText from "./MatchedText";
import Tag from "./Tag";

import throttle from "@/utils/throttle";
import clamp from "@/utils/clamp";
import formatDate from "@/utils/formatDate";

import projects from "@/lib/projects";
import work from "@/lib/work";

function Preview({
  title,
  image,
  children,
  link,
  query,
  projectId,
  ...rest
}: {
  title: string;
  image: React.ReactNode;
  children: React.ReactNode;
  link?: string;
  query?: string;
  projectId?: string;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  const className =
    "group flex aspect-square w-full flex-col gap-4 rounded-3xl bg-surface px-10 py-8 text-text-dark";

  // * Can't move content to a separate component because of wonky img caching
  // * I'm sorry, this hurts me too

  return projectId ? (
    <ProjectLink id={projectId} className={className} {...rest}>
      <div className="grid w-full flex-grow place-items-center">{image}</div>
      <h3 className="h3 pointer-events-none">
        {query && <MatchedText query={query}>{title}</MatchedText>}
        {!query && title}
      </h3>
      {children}
    </ProjectLink>
  ) : (
    <Link href={link ?? "/"} className={className} {...rest}>
      <div className="grid w-full flex-grow place-items-center">{image}</div>
      <h3 className="h3 pointer-events-none">
        {query && <MatchedText query={query}>{title}</MatchedText>}
        {!query && title}
      </h3>
      {children}
    </Link>
  );
}

export function ProjectPreview({
  slug,
  query,
  hidden = false,
}: {
  slug: string;
  query?: string;
  hidden?: boolean;
}) {
  const { title, tags } = projects[slug];
  const queryRegex = new RegExp(`(${query})`, "gi");

  return (
    <Preview
      title={title}
      query={query}
      projectId={slug}
      style={{ display: hidden ? "none" : "flex" }}
      image={
        <img
          src={`/projects/${slug}/thumbnail.png`}
          alt={title}
          width={466}
          height={298}
          className="scale-95 rounded-3xl object-cover shadow-project-light will-change-transform group-hover:scale-100 group-hover:shadow-project-light-expanded"
          style={{
            transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
          }}
        />
      }
    >
      <ul className="span flex items-center gap-3">
        {tags
          .sort(
            (a, b) =>
              (b.match(queryRegex)?.length ?? 0) -
              (a.match(queryRegex)?.length ?? 0),
          )
          .slice(0, 3)
          .map((tag, i) => (
            <Tag key={i} query={query}>
              {tag}
            </Tag>
          ))}
      </ul>
    </Preview>
  );
}

const imageSize = 252;
const glareSize = Math.sqrt(2 * imageSize ** 2);

export function WorkPreview({ slug }: { slug: string }) {
  const { title, role, startDate, endDate } = work[slug];

  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shineAngle, setShineAngle] = useState(0);
  const [shineOpacity, setShineOpacity] = useState("0");

  const onMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLAnchorElement>) => {
      const dampingFactor = 25;

      const card = e.target as HTMLElement;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left,
        y = e.clientY - top;
      const centerX = width / 2,
        centerY = height / 2;
      const rotateX = (y - centerY) / dampingFactor,
        rotateY = (centerX - x) / dampingFactor;

      const xPercentage = (x / width) * 100,
        yPercentage = (y / height) * 100;
      const shineAngle = Math.abs(
        Math.atan2(yPercentage, -xPercentage) * (180 / Math.PI),
      );

      const shineOpacityFactor = clamp(
        0,
        Math.hypot(xPercentage, yPercentage),
        100,
      );
      const shineMaxOpacity = 0.25;

      setRotate({ x: rotateX, y: rotateY });
      setShineAngle(shineAngle);
      setShineOpacity(
        ((shineOpacityFactor * shineMaxOpacity) / 100).toString(),
      );
    }, 10),
    [],
  );

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShineAngle(0);
    setShineOpacity("0");
  };

  return (
    <Preview
      title={title}
      link={`/work/${slug}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      image={
        <div
          className="relative overflow-hidden rounded-5xl will-change-transform"
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
            transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
          }}
        >
          <img
            src={`/work/${slug}.png`}
            alt={title}
            width={252}
            height={252}
            className="rounded-5xl object-contain shadow-project-light will-change-transform"
          />
          <div
            style={{
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              transform: `rotate(${shineAngle}deg) translate(-50%, -50%)`,
              transition:
                "transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99), opacity 1s ease-out",
              background:
                "linear-gradient(0deg, rgba(255,255,255,0) 0%, white 100%)",
              width: glareSize,
              height: glareSize,
              opacity: shineOpacity,
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 origin-top-left will-change-transform"
          />
        </div>
      }
    >
      <span className="span pointer-events-none">
        {role} • {formatDate(startDate)} - {formatDate(endDate)}
      </span>
    </Preview>
  );
}
