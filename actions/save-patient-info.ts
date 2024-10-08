"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { PatientInformationSchema } from "@/schemas";
import { getPatientByName } from "@/data/user";

export const savePatientInfo = async (values: z.infer<typeof PatientInformationSchema>) => {
    const validatedFields = PatientInformationSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const {
        name,
        city,
        completeAddress,
        age,
        sex,
        birthday,
        civilStatus,
        occupation,
        handedness,
        religion,
        phone,
        email,
        lastVisit,
        imageUrl,
    } = validatedFields.data;

    const parsedBirthday = birthday ? new Date(birthday) : null;

    if (parsedBirthday != null && parsedBirthday >= new Date()) {
        return { error: "Birthday cannot be in the future." };
    }

    const parsedLastVisit = lastVisit ? new Date(lastVisit) : null;

    const existingPatient = await getPatientByName(name);

    if (existingPatient) {
        return { error: "Patient already exists." };
    }

    const newPatient = await db.patientInformation.create({
        data: {
            name,
            city,
            completeAddress,
            age,
            sex,
            birthday: parsedBirthday,
            civilStatus,
            occupation,
            handedness,
            religion,
            phone,
            email,
            lastVisit: parsedLastVisit,
            lastUpdate: new Date(),
            imageURL: imageUrl,
        },
    });

    return { success: 'Patient information saved. Please proceed by pressing "Add Patient Vitals".', patientId: newPatient.id };
};