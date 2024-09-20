"use server";

import { db } from "@/lib/db";

export async function fetchQueueEntries(queueId: string) {
  try {
    const queueEntries = await db.queueEntry.findMany({
      where: { queueId },
      include: {
        patient: true, // Include related patient information
      },
      orderBy: { position: "asc" }, // Ensure they are ordered by position
    });

    return { success: true, queueEntries };
  } catch (error) {
    console.error("Failed to fetch queue entries:", error);
    return { success: false, error: "Failed to fetch queue entries" };
  }
}
