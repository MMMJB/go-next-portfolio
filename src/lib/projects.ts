const baseProjects = [
  {
    title: "Launched",
    description:
      "An NPM package to make any website editable. It enables freelance clients to modify their websites with zero codebase access or programming experience necessary.",
    tags: ["ReactJS", "Typescript", "NodeJS", "Rollup"],
    startDate: "May 2024",
    endDate: "Present",
    status: "underway",
    github: "https://github.com/launchsite-tech/launched",
    package: "https://www.npmjs.com/package/launched",
    website: "https://launched.tech",
    work: "Launch",
  },
  {
    title: "Portfolio",
    description:
      "My personal website to showcase my projects and experience, built with a NextJS/Tailwind frontend and a Go/Vercel backend.",
    tags: ["NextJS", "TailwindCSS", "Go", "MongoDB", "Vercel"],
    startDate: "Jan 2024",
    endDate: "Sep 2024",
    status: "underway",
    github: "https://github.com/MMMJB/go-next-portfolio",
  },
  {
    title: "Quilli",
    description:
      "A document creation tool made to improve the poetry writing workflow. My introduction to ReactJS and my first fullstack project.",
    tags: ["Vite", "Firebase", "Socket.io", "ReactJS", "TailwindCSS"],
    startDate: "Jul 2023",
    endDate: "Aug 2023",
    status: "abandoned",
    github: "https://github.com/MMMJB/Quilli-react",
  },
] satisfies Omit<Project, "searchString">[];

const projects: Project[] = baseProjects.map((project) => ({
  ...project,
  searchString:
    `${project.title} ${project.description} ${project.tags.join(" ")}`.toLowerCase(),
}));

export const featuredProjects = projects.slice(0, 3);

export default projects;
