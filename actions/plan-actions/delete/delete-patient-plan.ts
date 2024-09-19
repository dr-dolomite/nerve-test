"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientPlanSchema } from "@/schemas";

export const deletePatientPlan = async (planId: string, recordId: string) => {
  if (!planId || planId === "") {
    return { error: "Plan cannot be retrieved." };
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

  //   Remove the plan from history or follow-up record
    if (existingPatientPlan) {
        await db.patientPlan.delete({
        where: {
            id: planId,
        },
        });
    
        return { success: "Plan deleted successfully. Please refresh the page." };
    } else {
        return { error: "Plan not found." };
  }
};
