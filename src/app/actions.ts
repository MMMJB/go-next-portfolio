"use server";

import { revalidatePath } from "next/cache";

export async function fetchAllVisitors(): Promise<Visitor[]> {
  const response = await fetch(process.env.WEB_URI + "/api/visitors");
  const data = await response.json();

  return data;
}

export async function createVisitor(newVisitor: Visitor) {
  console.log("Adding visitor...");

  await fetch(
    process.env.WEB_URI +
      `/api/newVisitor?avatar=${newVisitor.avatar}&name=${newVisitor.name}&message=${newVisitor.message}`,
  );

  console.log("Visitor added.");

  revalidatePath("/app");
}
