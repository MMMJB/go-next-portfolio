import MatchedText from "./MatchedText";

export default function Tag({
  children,
  query,
}: {
  children: string;
  query?: string;
}) {
  return (
    <li className="span rounded-full border border-text-dark px-2.5 py-0.5">
      <MatchedText query={query ?? ""}>{children}</MatchedText>
    </li>
  );
}
