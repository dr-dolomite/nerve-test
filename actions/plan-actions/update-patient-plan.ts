"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientPlanSchema } from "@/schemas";
import next from "next";

export const updatePatientPlan = async (
  values: z.infer<typeof PatientPlanSchema>
) => {
  const validatedFields = PatientPlanSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { planId, recordId, nextVisit, medication, specialNotes, planItems } =
    validatedFields.data;

  const nextVisitDate = nextVisit ? new Date(nextVisit) : null;

  // If the next visit date is before or equal to today
  if (nextVisitDate && nextVisitDate <= new Date()) {
    return { error: "The follow up date should be in the future." };
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

  // Update the record
  await db.patientPlan.update({
    where: {
      id: planId,
    },
    data: {
      nextVisit: nextVisitDate,
      followUpNotes: specialNotes,
      medication: medication,
      planItems,
    },
  });

  return { success: "Plan updated. Please proceed." };
};
