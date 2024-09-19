import * as z from 'zod';

const today = new Date();

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address',
    }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address',
    }),
    password: z.string().min(8, {
        message: 'Minimum of 8 characters required',
    }),

    firstName: z.string().min(1, {
        message: 'First name is required',
    }),

    lastName: z.string().min(1, {
        message: 'Last name is required',
    }),

    // name: z.string().min(3, {
    //     message: 'Full name is required',
    // }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address',
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: 'Minimum of 8 characters required',
    }),
});

export const PatientInformationSchema = z.object({
    name: z.string().min(5, {
        message: 'Full name is required',
    }),
    city: z.string().optional(),
    completeAddress: z.string().optional(),
    age: z.number({
        message: 'Age must be a number.',
    }).min(1, {
        message: 'Age is required',
    }).max(130, {
        message: 'That seems to be incorrect.',
    }),
    sex: z.string().min(3, {
        message: 'Sex is required',
    }),
    birthday: z.string().optional(),
    civilStatus: z.string().optional(),
    occupation: z.string().optional(),
    handedness: z.string().min(3, {
        message: 'Handedness is required',
    }),
    religion: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    lastVisit: z.string().optional(),
    imageUrl: z.string().optional(),
    id: z.string().optional(),
});

export const PatientVitalsSchema = z.object({
    pulseRate: z.number().min(0, "Pulse rate must be at least 0").max(300, "Pulse rate must be at most 300"),
    bodyTemperature: z.string().min(1, "Body temperature is required"),
    bloodPressure: z.string().min(3, "Blood pressure is required"),
    weight: z.string().min(1, "Weight is required"),
    oxygen: z.number().min(0, "Oxygen level must be at least 0").max(100, "Oxygen level must be at most 100"),
    patientId: z.string().min(3, "Patient ID is required"),
});

export const PatientHistorySchema = z.object({
    patientId: z.string(),
    vitalSignsId: z.string().optional(),
    referredBy: z.string().optional(),
    chiefComplaint: z.string().min(3, "Chief complaint is required"),
    historyOfPresentIllness: z.string().min(3, "History of present illness is required"),
    pastMedicalHistory: z.string().min(3, "Past medical history is required"),
    familyHistory: z.string().min(3, "Family history is required"),
    personalSocialHistory: z.string().min(3, "Personal social history is required"),
    obgyneHistory: z.string().optional(),
    physicalExamination: z.string().min(3, "Physical examination is required"),
    neurologicalExamination: z.string().optional(),
    diagnosis: z.string().min(3, "Diagnosis is required"),
    labResults: z.string().optional(),
});

export const PatientFollowUpsSchema = z.object({
    patientId: z.string(),
    vitalSignsId: z.string().optional(),
    labResults: z.string().optional(),
    chiefComplaint: z.string().min(3, "Chief complaint is required"),
    so: z.string().min(3, "Subjective observation is required"),
    diagnosis: z.string().min(3, "Diagnosis is required"),
    treatment: z.string().min(3, "Treatment is required"),
    plan: z.string().min(3, "Plan is required"),
});

export const PatientPlanSchema = z.object({
    planId: z.string(),
    patientId: z.string(),
    recordId: z.string(),
    nextVisit: z.string().optional(),
    medication: z.string().optional(),
    specialNotes: z.string().optional(),
    planItems: z.array(z.string())
});

export const OPDPlanSchema = z.object({
    patientPlanId: z.string(),
    nextVisit: z.string().optional(),
    diagnosis: z.string().optional(),
    medication: z.string().optional(),
    OPDNotes: z.string().optional(),
});

export const LaboratoryRequestSchema = z.object({
    patientPlanId: z.string(),
    dateToBeTaken: z.string().optional(),
    followUpDate: z.string().optional(),
    laboratoryTests: z.array(z.string()),
    notes: z.string().optional(),
});

export const searchQuerySchema = z.object({
    name: z.string().min(3, {
        message: 'Name is required',
    }),
});