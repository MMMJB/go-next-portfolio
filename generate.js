/*
 * Generate projects dynamically:
 * Store all associated gallery images
 * Generate a blurhash for each image
 * Generate a slug for each project
 * Generate a search string for each project
 */

const fs = require("fs");
const sharp = require("sharp");
const { encode, decode } = require("blurhash");

const baseProjects = require("./projects.json");

function generateSlug(title) {
  return title.toLowerCase().replace(/\s/g, "-");
}

function generateSearchString(project) {
  return `${project.title} ${project.tags.join(" ")}`.toLowerCase();
}

async function generateGallery(slug) {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const blacklist = ["thumbnail"];

  const targetDir = `./public/projects/${slug}`;
  const allImages = fs.readdirSync(targetDir);
  const images = allImages.filter(
    (src) =>
      !blacklist.some((image) => src.includes(image)) &&
      validExtensions.includes(src.slice(-4)),
  );

  return await Promise.all(
    images.map(async (image) => {
      const src = `${targetDir}/${image}`;

      const buffer = await sharp(src)
        .raw()
        .ensureAlpha()
        .resize(1280, 628, { fit: "inside" })
        .toBuffer();

      const blurhash = encode(new Uint8ClampedArray(buffer), 1280, 628, 4, 4);

      return {
        src,
        blurhash,
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

      return {
        ...project,
        searchString,
        slug,
        gallery,
      };
    }),
  );

  fs.writeFileSync(
    "./src/lib/_generated.json",
    JSON.stringify(projects, null, 2),
  );
})();
