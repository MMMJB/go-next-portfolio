"use server";

import { revalidatePath } from "next/cache";

export async function fetchAllPoints() {
  const response = await fetch(process.env.WEB_URI + "/api/points");
  const data = await response.json();

  return data;
}

export async function createPoint(newPoint: Point) {
  console.log("Adding point...");

  await fetch(
    process.env.WEB_URI +
      `/api/newPoint?lat=${newPoint.lat}&lng=${newPoint.lng}&col=${newPoint.col}`,
  );

  console.log("Point added.");

  revalidatePath("/app");
}

export async function deletePoint(point: Point) {
  console.log("Removing point...");

  await fetch(
    process.env.WEB_URI + `/api/deletePoint?lat=${point.lat}&lng=${point.lng}`,
  );

  console.log("Point removed.");

  revalidatePath("/app");
}
