"use server";

import { revalidatePath } from "next/cache";

export async function reload(path: string) {
  revalidatePath(path);
}
