import { VisitorsProvider } from "@/contexts/visitorContext";
import Simulation from "@/components/Simulation";

export default function Home() {
  return (
    <div className="flex w-full gap-24">
      <VisitorsProvider>
        <Simulation />
      </VisitorsProvider>
      <div className="flex flex-col gap-1">
        <h1 className="wave collision w-max font-semibold">
          Hey, I&apos;m Michael!
        </h1>
        <p className="collision text-sm sm:text-justify">
          I’m a 16-year-old experienced in fullstack engineering and UI/UX
          design. I&apos;m the founder of{" "}
          <a href="https://launchsite.tech">Launch</a> and a frontend developer
          at a <a href="/projects">few other projects</a>. If you have any
          questions, feel free to <a href="/contact">contact me</a>.
        </p>
      </div>
      <div className="hidden w-full items-end justify-center sm:flex">
        <img src="/hoops.png" alt="" />
      </div>
    </div>
  );
}
