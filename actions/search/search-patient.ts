// app/actions/searchPatients.ts
"use server";

import { db } from "@/lib/db";

export async function searchPatients(query: string) {
  try {
    const patients = await db.patientInformation.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isNewPatient: true,
      },
      take: 10, // Limit the results to 10 for performance
    });

    return { success: true, patients };
  } catch (error) {
    console.error("Failed to search patients:", error);
    return { success: false, error: "Failed to search patients" };
  }
}
