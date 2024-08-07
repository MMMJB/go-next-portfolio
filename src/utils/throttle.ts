export default function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
) {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;

    lastCall = now;

    return func(...args);
  };
}
