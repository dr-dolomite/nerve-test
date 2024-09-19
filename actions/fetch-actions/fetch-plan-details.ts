"use server";

import { db } from "@/lib/db";

export async function fetchPlanDetails(planId: string) {
  try {
    const result = await db.patientPlan.findUnique({
      where: { id: planId },
      select: {
        medication: true,
        followUpNotes: true,
        nextVisit: true,
        planItems: true,
        OPDPlanForm: true,
        laboratoryRequest: true,
      },
    });

    if (!result) {
      return { error: "Plan not found" };
    }

    const patientPlanForm = result;

    console.log("patientPlanForm", patientPlanForm);

    const planData = {
      medication: patientPlanForm.medication || undefined,
      specialNotes: patientPlanForm.followUpNotes || undefined,
      nextVisit: patientPlanForm.nextVisit
        ? patientPlanForm.nextVisit.toISOString().split("T")[0]
        : undefined,
      planItems: patientPlanForm.planItems || undefined,
      OPDPlanForm: patientPlanForm.OPDPlanForm || undefined,
      laboratoryRequest: patientPlanForm.laboratoryRequest || undefined,
    };

    return {
      success: "Success in fetching patient plan data.",
      data: planData,
    };
  } catch (error) {
    console.error("Error in fetchPlanDetails:", error);
    return { error: "Error in fetching patient plan data." };
  }
}
