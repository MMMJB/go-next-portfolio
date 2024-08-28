import Project from "@/components/Project";

import type { Metadata, ResolvingMetadata } from "next";

import projects from "@/lib/projects";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <Project slug={params.id} />;
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { title, description, slug } = projects[params.id];

  const parentMetadata = await parent;

  const thumbnail = new URL(
    `${process.env.WEB_URI}/projects/${slug}/_thumbnail.png`,
  );

  return {
    title,
    description,
    openGraph: objWithNonNullValues({
      ...parentMetadata.openGraph,
      title,
      description,
      images: [thumbnail, ...(parentMetadata.openGraph?.images || [])],
    }),
    twitter: objWithNonNullValues({
      ...parentMetadata.twitter,
      title,
      description,
      images: [thumbnail, ...(parentMetadata.twitter?.images || [])],
    }),
  };
}

function objWithNonNullValues<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));
}
