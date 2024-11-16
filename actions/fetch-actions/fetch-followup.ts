"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientFollowUpsSchema } from "@/schemas";

export async function fetchFollowUpdata(followUpId: string) {
  try {
    const existingPlan = await db.patientFollowUps.findUnique({
        where: { id: followUpId },
    });

    if (!existingPlan) {
        return { success: "Please fill up the form." };
    }

    const followUpData = {
        followUpId: existingPlan.id,
        labResults: existingPlan.labResults || "",
        chiefComplaint: existingPlan.chiefComplaint || "",
        so: existingPlan.so || "",
        diagnosis: existingPlan.diagnosis || "",
        treatment: existingPlan.treatment || "",
    };

    const validatedData = PatientFollowUpsSchema.parse(followUpData);

    console.log("Follow-up data fetched successfully", validatedData);
    return { success: "Follow-up data fetched successfully", data: validatedData };

  } catch (error) {
    return { error: "Failed to fetch OPD plan" };
  }
}