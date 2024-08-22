import formatDate from "@/utils/formatDate";

import projects from "@/lib/projects";
import ScrollDate, { DateRuler } from "@/components/ScrollDate";
import Timeline from "@/components/Timeline";

const projectsList = Object.values(projects).map((p) => ({
  ...p,
  endDate: formatDate(p.endDate, "number") as number,
}));

const projectsByStartDate = projectsList.sort(
  (a, b) => b.startDate - a.startDate,
);

const min = projectsByStartDate[projectsByStartDate.length - 1].startDate;
const max = Math.max(...projectsByStartDate.map((project) => project.endDate));
const segmentSize = 1500;
const progressList = projectsByStartDate.map(({ startDate, endDate, _id }) => {
  const startProgress = (startDate - min) / (max - min);
  const duration = (endDate - startDate) / (max - min);

  return { startProgress, duration, _id };
});

export default function Journey() {
  return (
    <div
      id="journey"
      className="relative flex w-full justify-between"
      style={{
        height: `${segmentSize}px`,
      }}
    >
      <Timeline segmentSize={segmentSize} progressList={progressList} />
      <ScrollDate
        startDate={min}
        endDate={max}
        duration={max - min}
        container="journey"
        height={segmentSize}
      />
      <DateRuler height={segmentSize} startDate={min} endDate={max} />
    </div>
  );
}
