'use server'

import { db } from '@/lib/db'
import { QueueStatus } from '@prisma/client'

interface CurrentQueueState {
  success: boolean
  patientId: string | null
  message: string
  status: QueueStatus | null
  remainingPatients: number
}

export async function fetchCurrentQueueState(queueId: string): Promise<CurrentQueueState> {
  try {
    // Get current IN_PROGRESS patient
    const currentPatient = await db.queueEntry.findFirst({
      where: {
        queueId,
        status: QueueStatus.IN_PROGRESS
      },
      select: {
        patientId: true
      }
    })

    // Get count of remaining patients
    const remainingCount = await db.queueEntry.count({
      where: {
        queueId,
        status: QueueStatus.WAITING
      }
    })

    if (currentPatient) {
      return {
        success: true,
        patientId: currentPatient.patientId,
        status: QueueStatus.IN_PROGRESS,
        message: 'Current patient found',
        remainingPatients: remainingCount
      }
    }

    // If no IN_PROGRESS patient, get the first WAITING patient without changing status
    const waitingPatient = await db.queueEntry.findFirst({
      where: {
        queueId,
        status: QueueStatus.WAITING
      },
      orderBy: {
        position: 'asc'
      },
      select: {
        patientId: true
      }
    })

    return {
      success: true,
      patientId: waitingPatient?.patientId ?? null,
      status: waitingPatient ? QueueStatus.WAITING : null,
      message: waitingPatient ? 'Waiting patient found' : 'No patients in queue',
      remainingPatients: remainingCount
    }

  } catch (error) {
    console.error('Error fetching current queue state:', error)
    return {
      success: false,
      patientId: null,
      status: null,
      message: 'Failed to fetch queue state',
      remainingPatients: 0
    }
  }
}