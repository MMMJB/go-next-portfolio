import { Frown, GitHub, Package, ExternalLink } from "react-feather";
import { ProjectPreview } from "./Preview";
import Tag from "./Tag";
import Section from "./base/Section";
import Gallery from "./Gallery";

const statusColors = {
  complete: "bg-green-500",
  underway: "bg-yellow-400",
  abandoned: "bg-red-500",
};

const statusText = {
  complete: "Complete",
  underway: "In progress",
  abandoned: "Abandoned",
};

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

export default function Project({
  slug,
  projects,
}: {
  slug: string;
  projects: Project[];
}) {
  const project = projects.find((p) => p.slug === slug);

  if (!project)
    return (
      <div className="grid h-screen place-items-center">
        <h1 className="h1 text-text-dark">
          <Frown className="mx-auto" size={96} strokeWidth={1.5} />
          Project not found
        </h1>
      </div>
    );

  const similarProjects = projects.filter(
    (p) =>
      p.title !== project.title &&
      p.tags.some((t) => project?.tags.includes(t)),
  );

  const {
    title,
    startDate,
    endDate,
    description,
    tags,
    github,
    pkg,
    website,
    status,
    gallery,
  } = project;

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
            <ul className="flex gap-3">
              {tags.map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
            </ul>
            <p className="h3">{description}</p>
            <div className="flex gap-3">
              {github && (
                <SocialLink href={github}>
                  <GitHub />
                </SocialLink>
              )}
              {pkg && (
                <SocialLink href={pkg}>
                  <Package />
                </SocialLink>
              )}
              {website && (
                <SocialLink pill href={website} className="span">
                  View live deployment <ExternalLink className="text-xs" />
                </SocialLink>
              )}
              <SocialLink pill className="span cursor-default gap-3">
                <div
                  className={`${statusColors[status]} h-3 w-3 rounded-full`}
                />
                {statusText[status]}
              </SocialLink>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-10 text-text-dark">
          <h2 className="h3">Gallery</h2>
          <Gallery slug={slug} assets={gallery} />
        </section>
      </div>
      <Section title={`Similar projects (${similarProjects.length})`}>
        {similarProjects.map((project, i) => (
          <ProjectPreview key={i} {...project} />
        ))}
        {!similarProjects.length && (
          <p className="p col-span-2 flex flex-col items-center justify-center gap-3 rounded-md border border-border px-10 py-8 text-text-light">
            <Frown />
            No similar projects found.
          </p>
        )}
      </Section>
    </>
  );
}
