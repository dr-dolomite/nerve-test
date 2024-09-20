// app/actions/addToQueue.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface AddToQueueInput {
  queueId: string
  patientId: string
}

export async function addToQueue({ queueId, patientId }: AddToQueueInput) {
  try {
    // Get the current highest position in the queue
    const highestPosition = await db.queueEntry.findFirst({
      where: { queueId },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    const newPosition = (highestPosition?.position ?? 0) + 1

    // Add the patient to the queue
    await db.queueEntry.create({
      data: {
        queueId,
        patientId,
        position: newPosition,
        status: 'WAITING',
      },
    })

    // Revalidate the queue page to reflect changes
    revalidatePath('/dashboard/home')

    return { success: "Successfully added." }
  } catch (error) {
    console.error('Failed to add patient to queue:', error)
    return { error: 'Failed to add patient to queue' }
  }
}