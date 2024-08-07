import Social from "@/components/Social";
import { Linkedin, Instagram, GitHub, Mail, ArrowUpRight } from "react-feather";
import { ProjectPreview, WorkPreview } from "@/components/Preview";
import { VisitorsProvider } from "@/contexts/visitorContext";
import Simulation from "@/components/Simulation";
import CardSection from "@/components/base/Section";

import { featuredProjects } from "@/lib/projects";
import work from "@/lib/work";

export default function Home() {
  return (
    <>
      <section className="flex flex-col gap-16">
        <header className="grid grid-cols-2 gap-8">
          <h1 className="h1 text-text-dark">Michael Beck Developer</h1>
          <div className="flex flex-col justify-center gap-4">
            <p className="h3 animate-lines">
              I&rsquo;m a 17-year-old experienced in web dev and UI/UX.
              I&rsquo;m the founder of Launch and a frontend developer at a few
              other projects. If you&rsquo;d like to chat, feel free to contact
              me.
            </p>
            <div className="flex gap-3">
              <Social circular link="https://www.linkedin.com/in/michaelbeck0/">
                <Linkedin />
              </Social>
              <Social circular link="https://www.instagram.com/michael0beck/">
                <Instagram />
              </Social>
              <Social circular link="https://github.com/MMMJB">
                <GitHub />
              </Social>
              <Social circular link="mailto:beck.jacob.michael@gmail.com">
                <Mail />
              </Social>
            </div>
          </div>
        </header>
        <canvas id="strings" className="h-[320px]" />
      </section>
      <CardSection title="Work">
        {work.map((job) => (
          <WorkPreview key={job._id} {...job} />
        ))}
      </CardSection>
      <CardSection title="Featured projects">
        {featuredProjects.map((project) => (
          <ProjectPreview key={project._id} {...project} />
        ))}
        <a
          href="/projects"
          className="h3 flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-3xl border border-border text-text-dark"
        >
          See all projects
          <div className="grid h-12 w-12 place-items-center rounded-full bg-text-dark text-2xl text-white">
            <ArrowUpRight />
          </div>
        </a>
      </CardSection>
      <VisitorsProvider>
        <Simulation />
      </VisitorsProvider>
    </>
  );
}
