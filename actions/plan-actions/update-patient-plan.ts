"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientPlanSchema } from "@/schemas";

export const updatePatientPlan = async (values: z.infer<typeof PatientPlanSchema>) => {
    
        const validatedFields = PatientPlanSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return { error: "Invalid fields" };
        }
    
        const {
            planId,
            nextVisit,
            specialNotes,
            planItems,
        } = validatedFields.data;
    
        // Parse the next visit date
        if (!nextVisit) {
            return { error: "Next visit date is required." };
        }
    
        const nextVisitDate = new Date(nextVisit);
    
        // If the next visit date is before or equal to today
        if (nextVisitDate <= new Date()) {
            return { error: "Next visit date should be in the future." };
        }
    
        // Check if the record exists
        const record = await db.patientPlan.findUnique({
            where: {
                id: planId,
            },
        });
    
        if (!record) {
            return { error: "Record not found." };
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
            }
        });
    
        return { success: "Plan updated. Please proceed." };
}