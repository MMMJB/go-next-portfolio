"use client";

import { useState, useEffect } from "react";

import { Sun, Moon } from "react-feather";

export default function DarkModeToggle() {
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
      className={`${darkMode ? "text-text-dark" : "text-text-light"} fixed bottom-12 right-12`}
    >
      {darkMode !== null && (darkMode ? <Sun /> : <Moon />)}
    </button>
  );
}
