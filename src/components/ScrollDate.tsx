"use client";

import { useRef, useState, useEffect, useMemo } from "react";

const longDate = {
  month: "short",
  day: "numeric",
  year: "numeric",
} as const;

const topOffset = 80;

type SelectedProject = { _id: string; startDate: number; endDate: number };

export default function ScrollDate({
  startDate,
  endDate,
  duration,
  container,
  height,
  projects,
}: {
  startDate: number;
  endDate: number;
  duration: number;
  container: string;
  height: number;
  projects: { startDate: number; endDate: number; _id: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMonth = useRef(new Date(startDate).getMonth());

  const [date, setDate] = useState(startDate);
  const [selectedProjects, setSelectedProjects] = useState<SelectedProject[]>(
    [],
  );
  const dateString = useMemo(
    () => new Date(date).toLocaleDateString(undefined, longDate),
    [date],
  );

  const projectsByMonth = useMemo(() => {
    // year: month: projects
    const pbm: Record<number, Record<number, SelectedProject[]>> = {};

    projects.forEach(({ startDate, endDate, _id }) => {
      const start = new Date(startDate),
        end = new Date(endDate);
      const startMonth = start.getMonth(),
        endMonth = end.getMonth();
      const startYear = start.getFullYear(),
        endYear = end.getFullYear();

      for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0;
        const monthEnd = year === endYear ? endMonth : 11;

        for (let month = monthStart; month <= monthEnd; month++) {
          if (!pbm[year]) pbm[year] = {};
          if (!pbm[year][month]) pbm[year][month] = [];

          pbm[year][month].push({ _id, startDate, endDate });
        }
      }
    });

    return pbm;
  }, [projects]);

  function onScroll() {
    if (!containerRef.current) return;

    const { top: t } = containerRef.current.getBoundingClientRect();
    const top = t - topOffset;
    if (top > 0) return;

    const progress = Math.abs(top) / height;
    const date = Math.min(startDate + progress * duration, endDate);

    setDate(date);

    const dateDate = new Date(date);
    const month = dateDate.getMonth(),
      year = dateDate.getFullYear();

    if (month !== currentMonth.current) {
      setSelectedProjects(projectsByMonth[year][month] || []);
      currentMonth.current = month;
    }
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
      {selectedProjects
        .filter((p) => p.startDate <= date && p.endDate >= date)
        .map(({ _id }) => (
          <span key={_id}>{_id}</span>
        ))}
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
