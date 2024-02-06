"use server";

import { revalidatePath } from "next/cache";

export async function fetchAllPoints() {
  const response = await fetch(process.env.WEB_URI + "/api/points");
  const data = await response.json();

  return data;
}

export async function createPoint(newPoint: Point) {
  console.log("Updating points...");

  await fetch(
    process.env.WEB_URI +
      `/api/newPoint?lat=${newPoint.lat}&lng=${newPoint.lng}&col=${newPoint.col}`,
  );

  console.log("Points updated.");

  revalidatePath("/app");
}
