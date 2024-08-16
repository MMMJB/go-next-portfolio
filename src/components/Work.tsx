import { Frown, GitHub, ExternalLink } from "react-feather";
import { ProjectPreview } from "./Preview";
import Section from "./base/Section";
import Gallery from "./Gallery";

import allWork from "@/lib/work";

function SocialLink({
  href,
  children,
  pill,
  className,
  ...rest
}: {
  children: React.ReactNode;
  href?: string;
  pill?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <button
        className={`flex h-12 items-center justify-center gap-1 rounded-full border border-surface px-4 py-3 ${!pill && "w-12"} ${className}`}
        {...rest}
      >
        {children}
      </button>
    </a>
  );
}

export default function Work({ slug }: { slug: string }) {
  const work = allWork[slug];

  if (!work)
    return (
      <div className="grid h-screen place-items-center">
        <h1 className="h1 text-text-dark">
          <Frown className="mx-auto" size={96} strokeWidth={1.5} />
          Work not found
        </h1>
      </div>
    );

  const {
    title,
    startDate,
    endDate,
    role,
    description,
    github,
    website,
    gallery,
    projects,
  } = work;

  return (
    <>
      <div className="flex flex-col gap-20">
        <section className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 text-text-dark">
            <h1 className="h1">{title}</h1>
            <p className="h3">
              {startDate} - {endDate}
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <p className="h3">{description}</p>
            <div className="flex gap-3">
              {github && (
                <SocialLink href={github}>
                  <GitHub />
                </SocialLink>
              )}
              {website && (
                <SocialLink pill href={website} className="span">
                  Website <ExternalLink className="text-xs" />
                </SocialLink>
              )}
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-10 text-text-dark">
          <h2 className="h3">Gallery</h2>
          <Gallery assets={gallery} />
        </section>
      </div>
      <Section title={`Associated projects (${projects.length})`}>
        {projects.map((slug) => (
          <ProjectPreview key={slug} slug={slug} />
        ))}
        {!projects.length && (
          <p className="p col-span-2 flex flex-col items-center justify-center gap-3 rounded-md border border-border px-10 py-8 text-text-light">
            <Frown />
            No associated projects found.
          </p>
        )}
      </Section>
    </>
  );
}
