export default function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="h3 text-text-dark">{title}</h2>
      <div className="grid grid-cols-2 gap-5">{children}</div>
    </section>
  );
}
