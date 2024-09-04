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
        patientId,
        recordId,
        diagnosis,
        medication,
        OPDNotes,
        nextVisit,
    } = validatedFields.data;

    // Parse the next visit date
    const nextVisitDate = new Date(nextVisit);

    // If the next visit date is before or equal to today
    if (nextVisitDate <= new Date()) {
        return { error: "Next visit date should be in the future." };
    }

    // Check if the patient exists
    const patient = await db.patientInformation.findUnique({
        where: {
            id: patientId,
        },
    });

    if (!patient) {
        return { error: "Patient not found" };
    }

    // Check if the record exists
    const followUpId = await db.followUps.findUnique({
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

    // check if follow up plan already exists
    
    // Check if a follow-up plan already exists for this record
    const existingPlan = await db.followUpPlan.findFirst({
        where: {
            OR: [
                { followUpId: recordId },
                { historyId: recordId }
            ]
        }
    });

    if (existingPlan) {
        return { error: "Follow-up plan already exists." };
    }

    // Save the follow-up plan

    if(!followUpId) {
        await db.oPDPlan.create({
            data:{
                patient: {
                    connect: {
                        id: patientId,
                    },
                },
                PatientHistory: {
                    connect: {
                        id: recordId,
                    },
                },
                diagnosis,
                medication,
                opdNotes: OPDNotes,
                followUpDate: nextVisitDate,
                date: new Date(),
            }
        })
    }

    if (!historyId) {
        await db.oPDPlan.create({
            data:{
                patient: {
                    connect: {
                        id: patientId,
                    },
                },
                FollowUps: {
                    connect: {
                        id: recordId,
                    },
                },
                diagnosis,
                medication,
                opdNotes: OPDNotes,
                followUpDate: nextVisitDate,
                date: new Date(),
            }
        })
    }

    


    return { success: "OPD plan saved. Please proceed." };
};
