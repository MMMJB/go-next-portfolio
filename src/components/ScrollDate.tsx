"use client";

import { useRef, useState, useEffect, useMemo } from "react";

const longDate = {
  month: "short",
  day: "numeric",
  year: "numeric",
} as const;

const topOffset = 300;

export default function ScrollDate({
  startDate,
  endDate,
  duration,
  container,
  height,
}: {
  startDate: number;
  endDate: number;
  duration: number;
  container: string;
  height: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(startDate);
  const dateString = useMemo(
    () => new Date(date).toLocaleDateString(undefined, longDate),
    [date],
  );

  function onScroll() {
    if (!containerRef.current) return;

    const { top: t } = containerRef.current.getBoundingClientRect();
    const top = t - topOffset;
    if (top > 0) return;

    const progress = Math.abs(top) / height;
    const date = Math.min(startDate + progress * duration, endDate);

    setDate(date);
  }

  useEffect(() => {
    const containerElement = document.getElementById(container);
    if (!containerElement) return;

    // @ts-expect-error
    containerRef.current = containerElement;

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="span sticky z-50 flex w-max flex-col items-end gap-1.5 self-start"
      style={{ top: `${topOffset}px` }}
    >
      <span className="-translate-y-1/2">{dateString} -</span>
    </div>
  );
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function DateRuler({
  height,
  startDate,
  endDate,
}: {
  height: number;
  startDate: number;
  endDate: number;
}) {
  let startMonth = new Date(startDate).setDate(1);
  if (startMonth < startDate) {
    startMonth = new Date(startMonth).setMonth(
      new Date(startMonth).getMonth() + 1,
    );
  }

  const dates = useMemo(() => {
    const dates = [];
    const date = new Date(startMonth);

    while (date.getTime() < endDate) {
      dates.push(
        ((date.getTime() - startDate) / (endDate - startDate)) * height,
      );
      date.setMonth(date.getMonth() + 1);
    }

    return dates;
  }, [startDate, endDate]);

  return (
    <div className="absolute right-0 w-1 text-text-light/50">
      {dates.map((date, i) => (
        <span
          key={i}
          className="span absolute left-0 w-max -translate-y-1/2"
          style={{
            top: `${date}px`,
          }}
        >
          {months[(new Date(startMonth).getMonth() + i) % 12]}
        </span>
      ))}
    </div>
  );
}
