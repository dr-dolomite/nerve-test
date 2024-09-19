"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { LaboratoryRequestSchema } from "@/schemas";

export const saveLabRequestForm = async (values: z.infer<typeof LaboratoryRequestSchema>) => {
    const validatedFields = LaboratoryRequestSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const {
        patientPlanId,
        dateToBeTaken,
        followUpDate,
        laboratoryTests,
        notes,
    } = validatedFields.data;

    // Parse the next visit date
    const dateToBeTakenDate = dateToBeTaken ? new Date(dateToBeTaken) : "";

    // If the next visit date is before or equal to today
    if (dateToBeTakenDate !== "" && dateToBeTakenDate <= new Date()) {
        return { error: "Date to be taken should be in the future." };
    }
    
    const followUpDateParsed = followUpDate ? new Date(followUpDate) : "";

    // Check if the OPD plan already exists on the patient plan
    const existingLabReqForm = await db.labRequestForm.findFirst({
        where: {
            PatientPlan: {
                id: patientPlanId,
            },
        },
    });

    if (existingLabReqForm) {
        // Update the record instead of creating a new one. Also make the data optional since the user only updates one field sometimes.

        await db.labRequestForm.update({
            where: {
                id: existingLabReqForm.id,
            },
            data: {
                dateToBeTaken: dateToBeTakenDate,
                followUpDate: followUpDateParsed,
                laboratoryTests,
                notes,
            },
        });

        return { success: "Lab request form updated. Please proceed." };
    }
    
    // Save the record
    await db.labRequestForm.create({
        data: {
            PatientPlan: {
                connect: {
                    id: patientPlanId,
                },
            },
            dateToBeTaken: dateToBeTakenDate,
            followUpDate: followUpDateParsed,
            laboratoryTests,
            notes,
        }
    });

    return { success: "Lab request form saved. Please proceed." };
};
