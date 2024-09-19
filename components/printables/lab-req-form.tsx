import React, { forwardRef, useEffect, useState } from "react";
import { getPatientById } from "@/data/get-patient-info";

interface LabRequestFormPrintableProps {
  patientId: string;
  dateToTaken: string;
  selectedTests: string[];
  otherTests: string;
  clinicFollowUp: string;
}

const LabRequestFormPrintable = forwardRef<
  HTMLDivElement,
  LabRequestFormPrintableProps
>(
  (
    { patientId, dateToTaken, selectedTests, otherTests, clinicFollowUp },
    ref
  ) => {
    const [patient, setPatient] = useState<any>(null);

    useEffect(() => {
      const fetchPatientData = async () => {
        const patientData = await getPatientById(patientId);
        setPatient(patientData);
      };

      fetchPatientData();
    }, [patientId]);

    if (!patient) return null;

    const labItems = [
      {
        id: "1",
        label: "FBS",
      },
      {
        id: "2",
        label: "Urinalysis",
      },
      {
        id: "3",
        label: "BUN",
      },
      {
        id: "4",
        label: "Creatinine",
      },
      {
        id: "5",
        label: "CXR PA View",
      },
      {
        id: "6",
        label: "Uric Acid",
      },
      {
        id: "7",
        label: "ECG (12 Leads)",
      },
      {
        id: "8",
        label: "Lipid Profile",
      },
      {
        id: "9",
        label: "T4",
      },
      {
        id: "10",
        label: "SGPT",
      },
      {
        id: "11",
        label: "T3",
      },
      {
        id: "12",
        label: "HbA1c",
      },
      {
        id: "13",
        label: "TSH",
      },
      {
        id: "14",
        label: "Na, K",
      },
      {
        id: "15",
        label: "CBC",
      },
      {
        id: "16",
        label: "Serum Triglycerides",
      },
      {
        id: "17",
        label: "Platelet Count",
      },
    ];

    return (
      <div
        ref={ref}
        style={{
          padding: "1in",
          fontFamily: "Arial, sans-serif",
          fontSize: "12pt",
          lineHeight: "1.5",
          width: "8.5in",
          height: "11in",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "0.25in" }}>
          <h2
            style={{
              fontSize: "16pt",
              margin: "0 0 0.1in 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            EMMYLOU JANE C. BAYLOSIS-VALENCIA, M.D.
          </h2>
          <p
            style={{
              fontSize: "12pt",
              margin: "0 0 0.1in 0",
              textAlign: "center",
            }}
          >
            INTERNAL MEDICINE - NEUROLOGY
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10pt",
            }}
          >
            <div style={{ textAlign: "left" }}>
              ROOM 401-MAB
              <br />
              Iloilo Mission Hospital
              <br />
              Mission Road, Jaro, Iloilo City
              <br />
              Tel. No. 3200315 Loc. 6071
              <br />
              Mon - Fri: 9:00am - 3:00pm
            </div>
            <div style={{ textAlign: "right" }}>
              Hospital Affiliations:
              <br />
              Iloilo Mission Hospital
              <br />
              The Medical City
              <br />
              Metro Iloilo Hospital Medical Center, Inc.
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <div style={{ marginBottom: "0.5in" }}>
          <p>
            <strong>Patient&apos;s: </strong> {patient.name}
          </p>
          <p>
            <strong>Address: </strong> {patient.completeAddress}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span>
              <strong>Date: </strong> {new Date().toLocaleDateString()}
            </span>
            <span>
              <strong>Age: </strong> {patient.age}
            </span>
            <span>
              <strong className="capitalized">Sex: </strong> {patient.sex}
            </span>
          </div>
        </div>

        {/* Laboratory Request Section */}
        <div style={{ marginBottom: "0.5in" }}>
          <h3
            style={{
              textAlign: "center",
              fontSize: "14pt",
              marginBottom: "0.25in",
            }}
          >
            LABORATORY REQUEST
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5em",
            }}
          >
            {labItems.map((item) => (
              <div key={item.id}>
                <input
                  type="checkbox"
                  id={item.id}
                  checked={selectedTests.includes(item.id)}
                  readOnly
                />
                <label htmlFor={item.id}>{item.label}</label>
              </div>
            ))}
          </div>
          <p>
            <strong>Others, specify:</strong> {otherTests}
          </p>
        </div>

        {/* Follow-up Section */}
        <div style={{ marginBottom: "0.5in" }}>
          <p>
            <strong>Date to be taken:</strong> {dateToTaken}
          </p>
          <p>
            <strong>Clinic follow-up on:</strong> {clinicFollowUp}
          </p>
        </div>

        {/* Footer Section */}
        <div style={{ marginTop: "0.5in" }}>
          <p style={{ fontSize: "10pt", margin: "0" }}>
            EMMYLOU JANE C. BAYLOSIS-VALENCIA, M.D.
          </p>
          <p style={{ fontSize: "10pt", margin: "0" }}>Lic No: 102582</p>
          <p style={{ fontSize: "10pt", margin: "0" }}>PTR No:</p>
          <p style={{ fontSize: "10pt", margin: "0" }}>S2 No:</p>
        </div>
      </div>
    );
  }
);

LabRequestFormPrintable.displayName = "LabRequestFormPrintable";

export default LabRequestFormPrintable;
