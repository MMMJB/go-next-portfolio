export default function Social({
  children,
  link,
  className,
  circular,
}: {
  children: React.ReactNode;
  link: string;
  className?: string;
  circular?: boolean;
}) {
  return (
    <a
      href={link}
      target="_blank"
      className={`${className} ${circular ? "h-12 w-12" : "px-4 py-3"} border-border flex items-center justify-center gap-1 rounded-full border text-base text-text-light`}
    >
      {children}
    </a>
  );
}
