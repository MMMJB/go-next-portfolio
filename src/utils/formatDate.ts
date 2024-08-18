const dateOptions = { month: "short", year: "numeric" } as const;

export default function formatDate(
  date: number | "Present",
  format: "string" | "number" = "string",
) {
  if (format === "string") {
    return date === "Present"
      ? "Present"
      : new Date(date).toLocaleDateString(undefined, dateOptions);
  } else {
    return date === "Present" ? Date.now() : new Date(date).getTime();
  }
}
