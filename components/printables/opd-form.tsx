import { forwardRef, useEffect, useState } from "react";
import { getPatientById } from "@/data/get-patient-info";
import { getPatientHistoryById } from "@/data/get-patient-info";

interface OPDPrintableComponentProps {
    patientId: string;
    nextVisit: string;
    diagnosis: string;
    medication: string;
    OPDNotes: string;
}

const OPDPrintableComponent = forwardRef<HTMLDivElement, OPDPrintableComponentProps>(
    ({ patientId, nextVisit, diagnosis, medication, OPDNotes }, ref) => {
        const [patient, setPatient] = useState<any>(null);
        const [patientHistory, setPatientHistory] = useState<any>(null);

        useEffect(() => {
            const fetchPatientData = async () => {
                const patientData = await getPatientById(patientId);
                setPatient(patientData);
            };

            const fetchHistoryData = async () => {
                const patientHistoryData = await getPatientHistoryById(patientId);
                setPatientHistory(patientHistoryData);
            }

            fetchHistoryData();
            fetchPatientData();
        }, [patientId]);

        if (!patient) return null;

        return (
            <div ref={ref} style={{ padding: "1in", fontFamily: "Arial, sans-serif", fontSize: "12pt", lineHeight: "1.5", width: "8.5in", height: "11in" }}>
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: "0.5in" }}>
                    <h2 style={{ fontSize: "16pt", margin: "0", fontWeight: "bold" }}>EMMYLOU JANE C. BAYLOSIS-VALENCIA, M.D.</h2>
                    <p style={{ fontSize: "12pt", margin: "0" }}>INTERNAL MEDICINE - NEUROLOGY</p>
                    <p style={{ fontSize: "10pt", margin: "0" }}>
                        ROOM 401-MAB<br />
                        Iloilo Mission Hospital<br />
                        Mission Road, Jaro, Iloilo City<br />
                        Tel. No. 3200315 Loc. 6071<br />
                        Mon - Fri: 9:00am - 3:00pm
                    </p>
                    <hr style={{ borderTop: "2px solid black", marginTop: "0.25in", marginBottom: "0.25in" }} />
                </div>

                {/* Patient Information Section */}
                <div >
                    <div className="grid gap-2">
                    <div className="grid grid-flow-row grid-cols-3 gap-2 content-center">
                        <p className="col-span-2"><strong>Patient: </strong> {patient.name}</p>
                        <p><strong>Date: </strong> {new Date().toLocaleDateString()}</p>
                        <p className="col-span-2"><strong>Age: </strong> {patient.age}</p>
                        <p className="capitalize"><strong>Sex: </strong> {patient.sex}</p>
                    </div>
                    <p className="text-wrap"><strong>Address: </strong> <br/> {patient.completeAddress}</p>
                    <p className="text-wrap"><strong>Chief Complaint: </strong> <br/>{patientHistory.chiefComplaint}</p>
                    </div>
                    <hr style={{ borderTop: "2px solid black", marginTop: "0.25in", marginBottom: "0.25in" }} />
                </div>

                {/* OPD Plan Section */}
                <div style={{ marginBottom: "0.5in" }}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 grid-flow-row gap-4">
                        <p className="text-wrap"><strong>Diagnosis:</strong> <br/>{diagnosis}</p>
                        <p className="text-wrap"><strong>Medication:</strong> <br/> {medication}</p>
                        </div>
                        <div className="grid gap-1 mt-2">
                        <p className="text-wrap"><strong>Notes:</strong> <br/> {OPDNotes}</p>
                        <p className="mt-2"><strong>Next Visit:</strong> {nextVisit}</p>
                        </div>

                    </div>
                    <hr style={{ borderTop: "2px solid black", marginTop: "0.25in", marginBottom: "0.25in" }} />
                </div>

                {/* Footer Section */}
                <div style={{ marginTop: "0.5in" }}>
                    <p style={{ fontSize: "10pt", margin: "0" }}>EMMYLOU JANE C. BAYLOSIS-VALENCIA, M.D.</p>
                    <p style={{ fontSize: "10pt", margin: "0" }}>Lic No: 102582</p>
                    <p style={{ fontSize: "10pt", margin: "0" }}>PTR No:</p>
                    <p style={{ fontSize: "10pt", margin: "0" }}>S2 No:</p>
                </div>
            </div>
        );
    }
);

OPDPrintableComponent.displayName = "OPDPrintableComponent";

export default OPDPrintableComponent;
