export function TextInput({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type={type ?? "text"}
      className={`${className} p rounded-md border border-border bg-white px-5 py-3 outline-none outline-1 outline-offset-0 transition-all placeholder:text-text-light/50 focus:rounded-lg focus:outline-offset-2 focus:outline-border`}
    />
  );
}
