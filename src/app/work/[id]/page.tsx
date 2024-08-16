import Work from "@/components/Work";

export default function WorkPage({ params }: { params: { id: string } }) {
  return <Work slug={params.id} />;
}
