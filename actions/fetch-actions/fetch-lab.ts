"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { LaboratoryRequestSchema } from "@/schemas";

export async function fetchLabRequestPlan(patientPlanId: string) {
  try {
    const existingPlan = await db.patientPlan.findUnique({
      where: { id: patientPlanId },
      include: {
        laboratoryRequest: true,
      },
    });

    if (!existingPlan || !existingPlan.laboratoryRequest[0]) {
      return { success: "Please fill up the form." };
    }

    const labRequestForm = existingPlan.laboratoryRequest[0];

    // Prepare the data to match the schema
    const labRequestData = {
      patientPlanId: existingPlan.id,
      followUpDate: labRequestForm.followUpDate
        ? labRequestForm.followUpDate.toISOString().split("T")[0]
        : undefined,
      dateToBeTaken: labRequestForm.dateToBeTaken
        ? labRequestForm.dateToBeTaken.toISOString().split("T")[0]
        : undefined,
        notes: labRequestForm.notes || "",
        laboratoryTests: labRequestForm.laboratoryTests || [],
    };

    const validatedData = LaboratoryRequestSchema.parse(labRequestData);

    return { success: "Laboratory request fetched successfully", data: validatedData };
  } catch (error) {
    console.error("Error in fetchLabRequestPlan:", error);
    return { error: "Failed to fetch lab request form" };
  }
}
