// app/actions/getOrCreateQueue.ts
'use server'

import { db } from "@/lib/db";

export async function getOrCreateQueue() {
  try {
    let queue = await db.queue.findFirst({
      where: { isActive: true },
    });

    if (!queue) {
      queue = await db.queue.create({
        data: {
          name: 'Default Queue',
          isActive: true,
        },
      });
    }

    return { success: "Queue ID provided successfully", queueId: queue.id };
  } catch (error) {
    console.error('Failed to get or create queue:', error);
    return { error: 'Failed to get or create queue' };
  }
}