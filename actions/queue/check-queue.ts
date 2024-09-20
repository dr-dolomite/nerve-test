"use server";

import { db } from "@/lib/db";

export async function checkQueue(queueId: string) {
  try {
    const queue = await db.queue.findFirst({
      where: { id: queueId },
      include: {
        entries: {
          include: { patient: true },
          orderBy: { position: "asc" },
        },
      },
    });

    return { success: "Successfully fetched", queue };
  } catch (error) {
    console.error("Failed to check queue:", error);
    return { error: "Failed to check queue" };
  }
}