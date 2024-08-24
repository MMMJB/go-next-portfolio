import dynamic from "next/dynamic";
import { fetchAllVisitors } from "@/app/actions";
import sharp from "sharp";

const SimulationWithNoSSR = dynamic(() => import("@/components/Simulation"), {
  ssr: false,
});

export default async function SimulationProvider() {
  async function prepareAllAvatars(
    visitors: Visitor[],
  ): Promise<Record<string, string>> {
    if (!visitors.length) return {};

    const avatars = visitors.map((visitor) => visitor.avatar);

    const roundedCorners = Buffer.from(
      `<svg><rect x="0" y="0" width="100" height="100" rx="50" ry="50"/></svg>`,
    );

    const images = await Promise.all(
      avatars.map(async (avatar) => {
        const image = await fetch(avatar);
        const imageData = await image.arrayBuffer();

        const data = await sharp(imageData)
          .resize(100, 100)
          .composite([
            {
              input: roundedCorners,
              blend: "dest-in",
            },
          ])
          .png()
          .toBuffer();
        return `data:image/png;base64,${data.toString("base64")}`;
      }),
    );

    return avatars.reduce(
      (acc, avatar, i) => {
        acc[avatar] = images[i];
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  const data = await fetchAllVisitors();
  const images = await prepareAllAvatars(data);

  return (
    <SimulationWithNoSSR
      visitors={data.map((visitor) => ({
        ...visitor,
        avatar: images[visitor.avatar],
      }))}
    />
  );
}
