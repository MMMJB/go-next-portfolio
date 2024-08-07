"use client";

import { useRef, useState, useEffect } from "react";

import { ChevronDown } from "react-feather";

export function TextInput({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type={type ?? "text"}
      className={`${className} p rounded-md border border-border bg-white px-5 py-3 outline-none outline-1 outline-offset-0 transition-all placeholder:text-text-light/50 focus:outline-offset-2 focus:outline-border`}
    />
  );
}

export function Dropdown({
  className,
  options,
  selected,
  disabled,
  onChange,
  ...props
}: {
  options: string[];
  selected: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(selected);

  function onClickOutside(e: MouseEvent) {
    if (!containerRef.current) return;

    if (!containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", onClickOutside);

    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onChange) onChange(value);
  }, [value]);

  return (
    <div ref={containerRef} {...props} className={`${className} p relative`}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-3 rounded-md border border-border px-5 py-3 outline-none outline-1 outline-offset-0 transition-all focus:outline-offset-2 focus:outline-border"
      >
        {value}
        <ChevronDown size={16} />
      </button>
      <div
        className={`absolute left-0 top-full flex w-full flex-col overflow-hidden rounded-md border border-border bg-white transition-all ${isOpen ? "opacity-full translate-y-2" : "translate-y-0 opacity-0"}`}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              setValue(option);
              setIsOpen(false);
            }}
            className="cursor-pointer px-3 py-2 text-left transition-colors hover:bg-border/25"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
