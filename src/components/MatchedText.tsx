export default function MatchedText({
  query,
  children,
}: {
  query: string;
  children: string;
}) {
  const parts = children.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) => (
    <span
      key={index}
      className={
        part.toLowerCase() === query.toLowerCase() ? "bg-yellow-300" : ""
      }
    >
      {part}
    </span>
  ));
}
