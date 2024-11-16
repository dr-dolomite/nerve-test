"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientFollowUpsSchema } from "@/schemas";

export const savePatientFollowup = async (values: z.infer<typeof PatientFollowUpsSchema>) => {
    const validatedFields = PatientFollowUpsSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const {
        patientId,
        vitalSignsId,
        labResults,
        chiefComplaint,
        so,
        diagnosis,
        treatment,
    } = validatedFields.data;

    try {
        // Check if the patient exists
        const patient = await db.patientInformation.findUnique({
            where: {
                id: patientId,
            },
        });

        if (!patient) {
            return { error: "Patient not found" };
        }

        // Check if the vital signs exist
        const vitalSigns = await db.patientVitalSigns.findUnique({
            where: {
                id: vitalSignsId,
            },
        });

        if (!vitalSigns) {
            return { error: "Vital signs not found" };
        }

        // Upsert the follow-up record
        const upsertedFollowUp = await db.patientFollowUps.upsert({
            where: {
                // Using vitalSignsId as the unique identifier since it's marked as @unique in the schema
                vitalSignsId: vitalSignsId,
            },
            update: {
                date: new Date(),
                labResults,
                chiefComplaint,
                so,
                diagnosis,
                treatment,
            },
            create: {
                date: new Date(),
                labResults,
                chiefComplaint,
                so,
                diagnosis,
                treatment,
                patient: {
                    connect: {
                        id: patientId,
                    },
                },
                vitalSigns: {
                    connect: {
                        id: vitalSignsId,
                    },
                }
            }
        });

        return { 
            success: "Patient follow-up record saved.", 
            followUpRecordId: upsertedFollowUp.id,
            message: upsertedFollowUp ? "Record updated" : "New record created"
        };

    } catch (error) {
        console.error("Error saving follow-up record:", error);
        return { error: "Failed to save follow-up record" };
    }
};