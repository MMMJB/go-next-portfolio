import projects from "./_generated-projects.json";

export default projects as Record<string, Project>;
export const featuredProjects = Object.keys(projects).slice(0, 3);
