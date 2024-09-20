// app/actions/reorderQueue.ts
"use server";

import { db } from "@/lib/db";

interface ReorderQueueInput {
  queueId: string;
  entries: { id: string; position: number }[];
}

export async function reorderQueue({ queueId, entries }: ReorderQueueInput) {

  if (!queueId || queueId === "") {
    return { error: "Invalid queue ID" };
  }
  try {
    // Update all entries in a single transaction
    await db.$transaction(
      entries.map((entry) =>
        db.queueEntry.update({
          where: { id: entry.id },
          data: { position: entry.position },
        })
      )
    );

    // Revalidate the queue page to reflect changes
    // revalidatePath("/dashboard/home");

    return { success: "Reordered successfully." };
  } catch (error) {
    console.error("Failed to reorder queue:", error);
    return { error: "Failed to reorder queue" };
  }
}
