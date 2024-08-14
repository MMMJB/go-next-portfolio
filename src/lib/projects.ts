import projects from "./_generated.json";

export default projects as Project[];
export const featuredProjects = projects.slice(0, 3);
