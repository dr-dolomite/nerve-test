"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { OPDPlanSchema } from "@/schemas";

export async function fetchOPDPlan(patientPlanId: string) {
  try {
    const existingPlan = await db.patientPlan.findUnique({
      where: { id: patientPlanId },
      include: {
        OPDPlanForm: true,
      },
    });

    if (!existingPlan || !existingPlan.OPDPlanForm[0]) {
      return { success: "Please fill up the form." };
    }

    const opdPlanForm = existingPlan.OPDPlanForm[0];

    // Prepare the data to match the schema
    const opdPlanData = {
      patientPlanId: existingPlan.id,
      nextVisit: opdPlanForm.followUpDate ? opdPlanForm.followUpDate.toISOString().split('T')[0] : undefined,
      diagnosis: opdPlanForm.diagnosis || "",
      medication: opdPlanForm.medication || "",
      OPDNotes: opdPlanForm.specialInstruction || "",
    };

    const validatedData = OPDPlanSchema.parse(opdPlanData);

    return { success: "OPD plan fetched successfully", data: validatedData };
  } catch (error) {
    console.error("Error in fetchOPDPlan:", error);
    return { error: "Failed to fetch OPD plan" };
  }
}