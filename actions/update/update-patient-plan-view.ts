"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientPlanSchema } from "@/schemas";
import { getPatientPlanById } from "@/data/get-patient-info";

export const updatePatientPlanNotesAndDate = async (
  values: z.infer<typeof PatientPlanSchema>
) => {
  const validatedFields = PatientPlanSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { nextVisit, specialNotes, planId } = validatedFields.data;

  const nextVisitDate = nextVisit ? new Date(nextVisit) : null;

  // If the next visit date is before or equal to today
  if (nextVisitDate && nextVisitDate <= new Date()) {
    return { error: "The follow up date should be in the future." };
  }

  if (!planId) {
    return { error: "Plan id is required." };
  }

  const existingPatientPlan = await getPatientPlanById(planId);

  if (!existingPatientPlan) {
    return { error: "Patient plan record not found." };
  }

  await db.patientPlan.update({
    where: {
      id: planId,
    },
    data: {
      ...(nextVisit && {
        nextVisit: nextVisitDate,
      }),
      ...(specialNotes && {
        followUpNotes: specialNotes,
      }),
    },
  });

  return { success: "Plan record updated successfully." };
};
