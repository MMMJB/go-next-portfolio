import Project from "@/components/Project";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <Project slug={params.id} />;
}
