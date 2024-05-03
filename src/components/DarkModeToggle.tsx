"use client";

import { useState, useEffect } from "react";

import { Sun, Moon } from "react-feather";

export default function DarkModeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark") ?? false);
  }, []);

  function switchTheme() {
    if (darkMode === null) return;

    window.localStorage.setItem("theme", darkMode ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
    setDarkMode((p) => !p);
  }

  return (
    <button
      onClick={switchTheme}
      className={`${darkMode ? "text-text-dark" : "text-text-light"} ${className}`}
    >
      {darkMode !== null && (darkMode ? <Sun size={20} /> : <Moon size={20} />)}
    </button>
  );
}
