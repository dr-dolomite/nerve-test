"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientPlanSchema } from "@/schemas";

export const savePatientPlan = async (
  values: z.infer<typeof PatientPlanSchema>
) => {
  const validatedFields = PatientPlanSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { patientId, recordId } = validatedFields.data;

  // Check if the patient exists
  const patient = await db.patientInformation.findUnique({
    where: {
      id: patientId,
    },
  });

  if (!patient) {
    return { error: "Patient not found" };
  }

  // Check if follow-up or history records exist
  const followUpId = await db.patientFollowUps.findUnique({
    where: {
      id: recordId,
    },
  });

  const historyId = await db.patientHistory.findUnique({
    where: {
      id: recordId,
    },
  });

  if (!followUpId && !historyId) {
    return { error: "Record not found" };
  }

  // Check if there is already a plan for this record
  const existingPatientPlan = await db.patientPlan.findFirst({
    where: {
      OR: [{ followUpId: recordId }, { historyId: recordId }],
    },
  });

  // If a plan already exists, return the plan ID
  if (existingPatientPlan) {
    return { success: "Select a plan at least one.", planId: existingPatientPlan.id };
  }

  // Create the initial plan record without requiring nextVisit or planItems
  const newPlan = await db.patientPlan.create({
    data: {
      patient: {
        connect: {
          id: patientId,
        },
      },
      ...(followUpId && {
        FollowUps: {
          connect: {
            id: recordId,
          },
        },
      }),
      ...(historyId && {
        PatientHistory: {
          connect: {
            id: recordId,
          },
        },
      }),
    },
  });

  // Return the newly created planId for later use
  return { success: "Select a plan at least one.", planId: newPlan.id };
};
