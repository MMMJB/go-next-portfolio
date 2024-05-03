(() => {
  window.addEventListener("mousedown", (e) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  });

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
})();
