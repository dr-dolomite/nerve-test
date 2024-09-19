"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { OPDPlanSchema } from "@/schemas";

export const saveOPDPlan = async (values: z.infer<typeof OPDPlanSchema>) => {
    const validatedFields = OPDPlanSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const {
        patientPlanId,
        diagnosis,
        medication,
        OPDNotes,
        nextVisit,
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

    // Current Date
    const currentDate = new Date();

    // Check if the OPD plan already exists on the patient plan
    const existingOPDPlan = await db.oPDPlanForm.findFirst({
        where: {
            PatientPlan: {
                id: patientPlanId,
            },
        },
    });

    if (existingOPDPlan) {
        // Update the record instead of creating a new one. Also make the data optional since the user only updates one field sometimes.

        await db.oPDPlanForm.update({
            where: {
                id: existingOPDPlan.id,
            },
            data: {
                diagnosis,
                medication,
                specialInstruction: OPDNotes,
                followUpDate: nextVisitDate,
                currentDate,
            },
        });

        return { success: "OPD plan updated. Please proceed." };
    }
    
    // Save the record
    await db.oPDPlanForm.create({
        data: {
            PatientPlan: {
                connect: {
                    id: patientPlanId,
                },
            },
            diagnosis,
            medication,
            specialInstruction: OPDNotes,
            followUpDate: nextVisitDate,
            currentDate,
        }
    });

    return { success: "OPD plan saved. Please proceed." };
};
