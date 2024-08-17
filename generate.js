/*
 * Generate projects dynamically:
 * Store all associated gallery images
 * Generate a blurhash for each image
 * Generate a slug for each project
 * Generate a search string for each project
 * Evaluate similar projects from tags
 *
 * Generate work dynamically:
 * Generate a slug for each work
 * Store all associated projects
 * Compile gallery images from associated projects
 */

const fs = require("fs");
const sharp = require("sharp");
const { encode } = require("blurhash");

const baseProjects = require("./projects.json");
const baseWork = require("./work.json");

function generateSlug(title) {
  return title.toLowerCase().replace(/\s/g, "-");
}

function generateSearchString(project) {
  return `${project.title} ${project.tags.join(" ")}`.toLowerCase();
}

function projectsToSlugs(projects) {
  return projects.map((project) => project.slug ?? generateSlug(project.title));
}

function generateSimilarProjects(projects, project) {
  const similarProjects = projects.filter(
    (baseProject) =>
      baseProject.tags.some((tag) => project.tags.includes(tag)) &&
      baseProject.title !== project.title,
  );

  const sortedSimilarProjects = similarProjects.sort((a, b) => {
    const aTags = a.tags.filter((tag) => project.tags.includes(tag));
    const bTags = b.tags.filter((tag) => project.tags.includes(tag));

    return bTags.length - aTags.length;
  });

  return projectsToSlugs(sortedSimilarProjects);
}

async function generateGallery(slug) {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const blacklist = ["thumbnail"];

  const targetDir = `./public/projects/${slug}`;

  if (!fs.existsSync(targetDir)) {
    console.warn(`No directory found for project: ${slug}`);
    return [];
  }

  const allImages = fs.readdirSync(targetDir);
  const images = allImages.filter(
    (src) =>
      !blacklist.some((image) => src.includes(image)) &&
      validExtensions.includes(src.slice(-4)),
  );

  return await Promise.all(
    images.map(async (image) => {
      const src = `${targetDir}/${image}`;

      // const buffer = await sharp(src)
      //   .raw()
      //   .ensureAlpha()
      //   .resize(1280, 628, { fit: "cover", position: "top" })

      //   .toFile(newSrc);

      // const blurhash = encode(new Uint8ClampedArray(buffer), 1280, 628, 4, 4);

      return {
        src: src.substring(8),
        // blurhash,
        blurhash: "null",
      };
    }),
  );
}

(async function () {
  const projects = await Promise.all(
    baseProjects.map(async (project) => {
      const slug = generateSlug(project.title);
      const searchString = generateSearchString(project);
      const gallery = await generateGallery(slug);
      const similarProjects = generateSimilarProjects(baseProjects, project);

      return {
        _id: slug,
        ...project,
        searchString,
        slug,
        gallery,
        similarProjects,
      };
    }),
  );

  const projectsMap = projects.reduce((acc, project) => {
    acc[project.slug] = project;
    return acc;
  }, {});

  fs.writeFileSync(
    "./src/lib/_generated-projects.json",
    JSON.stringify(projectsMap, null, 2),
  );

  const work = baseWork.map((work) => {
    const slug = generateSlug(work.title);
    const associatedProjects = projects.filter(
      (project) => project.work === work.title,
    );
    const gallery = associatedProjects.flatMap((project) => project.gallery);

    return {
      ...work,
      slug,
      gallery,
      projects: projectsToSlugs(associatedProjects),
    };
  });

  const workMap = work.reduce((acc, work) => {
    acc[work.slug] = work;
    return acc;
  }, {});

  fs.writeFileSync(
    "./src/lib/_generated-work.json",
    JSON.stringify(workMap, null, 2),
  );
})();
