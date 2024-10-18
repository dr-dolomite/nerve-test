"use server";

import { db } from "@/lib/db";
import { QueueStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getActiveQueueId() {
    try {
        const activeQueue = await db.queue.findFirst({
          where: {
            isActive: true
          },
          select: {
            id: true
          }
        })
        
        return activeQueue?.id ?? null
      } catch (error) {
        console.error('Error fetching active queue:', error)
        throw new Error('Failed to fetch active queue')
      }
    }
    
    // Handle next patient logic
    export async function handleNextPatient(queueId: string): Promise<string | null> {
      try {
        // First, check if there's a patient currently IN_PROGRESS
        const currentPatient = await db.queueEntry.findFirst({
          where: {
            queueId,
            status: QueueStatus.IN_PROGRESS
          }
        })
    
        if (currentPatient) {
          // Complete and remove the current patient
          await db.queueEntry.delete({
            where: {
              id: currentPatient.id
            }
          })
    
          // Reorder remaining patients' positions
          await db.queueEntry.updateMany({
            where: {
              queueId,
              position: {
                gt: currentPatient.position
              }
            },
            data: {
              position: {
                decrement: 1
              }
            }
          })
        }
    
        // Get the next waiting patient
        const nextPatient = await db.queueEntry.findFirst({
          where: {
            queueId,
            status: QueueStatus.WAITING
          },
          orderBy: {
            position: 'asc'
          }
        })
    
        if (!nextPatient) {
          return null
        }
    
        // Update the next patient's status to IN_PROGRESS
        const updatedPatient = await db.queueEntry.update({
          where: {
            id: nextPatient.id
          },
          data: {
            status: QueueStatus.IN_PROGRESS
          }
        })
    
        revalidatePath('/dashboard/home') // Adjust this path as needed
        return updatedPatient.patientId
    
      } catch (error) {
        console.error('Error handling next patient:', error)
        throw new Error('Failed to process next patient')
      }
}
