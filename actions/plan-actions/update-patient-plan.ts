"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientPlanSchema } from "@/schemas";

export const updatePatientPlan = async (
  values: z.infer<typeof PatientPlanSchema>
) => {
  const validatedFields = PatientPlanSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { planId, nextVisit, specialNotes, planItems } =
    validatedFields.data;

  const nextVisitDate = nextVisit ? new Date(nextVisit) : null;

  // If the next visit date is before or equal to today
  if (nextVisitDate && nextVisitDate <= new Date()) {
    return { error: "The follow up date should be in the future." };
  }

  if (!planId) {
    return { error: "Plan record does not exist." };
  }

  // Update the record
  await db.patientPlan.update({
    where: {
      id: planId,
    },
    data: {
      nextVisit: nextVisitDate,
      followUpNotes: specialNotes,
      planItems,
    },
  });

  return { success: "Plan updated. Please proceed." };
};
