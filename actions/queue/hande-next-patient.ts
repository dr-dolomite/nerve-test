'use server'

import { db } from '@/lib/db'
import { QueueStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

interface NextPatientResponse {
  success: boolean
  patientId: string | null
  message: string
  status: QueueStatus | null
}

export async function handleNextPatient(queueId: string): Promise<NextPatientResponse> {
  try {
    // First, check if there's a patient currently IN_PROGRESS
    const currentInProgressPatient = await db.queueEntry.findFirst({
      where: {
        queueId,
        status: QueueStatus.IN_PROGRESS
      },
      select: {
        id: true,
        patientId: true,
        position: true
      }
    })

    if (currentInProgressPatient) {
      // Mark current patient as completed and remove from queue
      await db.queueEntry.delete({
        where: {
          id: currentInProgressPatient.id
        }
      })

      // Reorder remaining patients' positions
      await db.queueEntry.updateMany({
        where: {
          queueId,
          position: {
            gt: currentInProgressPatient.position
          }
        },
        data: {
          position: {
            decrement: 1
          }
        }
      })

      // Get next waiting patient
      const nextPatient = await db.queueEntry.findFirst({
        where: {
          queueId,
          status: QueueStatus.WAITING
        },
        orderBy: {
          position: 'asc'
        },
        select: {
          id: true,
          patientId: true
        }
      })

      if (!nextPatient) {
        revalidatePath('/doctor/dashboard') // Adjust path as needed
        return {
          success: true,
          patientId: null,
          message: 'No more patients in queue',
          status: null
        }
      }

      // Update next patient to IN_PROGRESS
      const updatedPatient = await db.queueEntry.update({
        where: {
          id: nextPatient.id
        },
        data: {
          status: QueueStatus.IN_PROGRESS
        }
      })

      revalidatePath('/dashboard/home') // Adjust path as needed
      return {
        success: true,
        patientId: updatedPatient.patientId,
        message: 'Next patient set to IN_PROGRESS',
        status: QueueStatus.IN_PROGRESS
      }
    } else {
      // No patient currently IN_PROGRESS, get first waiting patient
      const nextPatient = await db.queueEntry.findFirst({
        where: {
          queueId,
          status: QueueStatus.WAITING
        },
        orderBy: {
          position: 'asc'
        },
        select: {
          id: true,
          patientId: true
        }
      })

      if (!nextPatient) {
        revalidatePath('/doctor/dashboard') // Adjust path as needed
        return {
          success: true,
          patientId: null,
          message: 'No patients in queue',
          status: null
        }
      }

      // Update first waiting patient to IN_PROGRESS
      const updatedPatient = await db.queueEntry.update({
        where: {
          id: nextPatient.id
        },
        data: {
          status: QueueStatus.IN_PROGRESS
        }
      })

      revalidatePath('/doctor/dashboard') // Adjust path as needed
      return {
        success: true,
        patientId: updatedPatient.patientId,
        message: 'First patient set to IN_PROGRESS',
        status: QueueStatus.IN_PROGRESS
      }
    }

  } catch (error) {
    console.error('Error handling next patient:', error)
    return {
      success: false,
      patientId: null,
      message: 'Failed to process next patient',
      status: null
    }
  }
}