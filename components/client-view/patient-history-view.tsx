"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getPatientHistoryById } from "@/data/get-patient-info";
import { getPatientVitalsById } from "@/data/get-patient-info";
import {
  FaThermometerHalf,
  FaHeartbeat,
  FaFillDrip,
  FaClock,
} from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
// import PatientPlanView from "@/components/view/patient-plan-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

interface PatientHistoryViewPageProps {
  patientId: string;
}

interface PatientHistory {
  id: string;
  patientId: string;
  referredBy: string | null;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  familyHistory: string;
  personalSocialHistory: string;
  obgyneHistory: string | null;
  physicalExamination: string;
  neurologicalExamination: string | null;
  vitalSignsid: string;
}

interface Vitals {
  id: string;
  bloodPressure: string;
  pulseRate: number;
  bodyTemperature: string;
  oxygen: number;
  weight: string;
}

const PatientHistoryViewPageClientSide = ({
  patientId,
}: PatientHistoryViewPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [patientHist, setPatientHist] = useState<PatientHistory | null>(null);
  const [patientVitals, setPatientVitals] = useState<Vitals | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const historyData = await getPatientHistoryById(patientId);
        setPatientHist(historyData);

        if (historyData?.vitalSignsid) {
          const vitalsData = await getPatientVitalsById(
            historyData.vitalSignsid
          );
          setPatientVitals(vitalsData);
        }
      } catch (err) {
        setError("Failed to fetch patient data");
        console.error("Error fetching patient data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Fetching patient history data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!patientHist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Missing Patient History</CardTitle>
          <CardDescription>
            No patient history record found for this patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="my-button-blue max-w-xs " asChild>
            <Link
              href={`/dashboard/add-patient-vitals?type=history&patientId=${patientId}`}
            >
              <PlusCircleIcon className="size-4 mr-2" />
              Add Patient History Record
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 grid-flow-row p-4 gap-8">
      Patient History: {patientHist.id}
      Vital Signs: {patientVitals?.id}
      <div className="col-span-2">
        <div className="grid 2xl:grid-cols-5 grid-cols-3 gap-4">
          <Card className="drop-shadow-md">
            <CardHeader className="text-center">
              <CardDescription>Blood Pressure</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex flex-row items-center justify-center">
              <CardTitle className="font-bold text-[#0E313E] text-4xl">
                {patientVitals?.bloodPressure}
              </CardTitle>
              <Label className="ml-2">
                mm <br /> Hg
              </Label>
            </CardContent>
          </Card>

          <Card className="drop-shadow-md">
            <CardHeader className="text-center">
              <CardDescription>Pulse Rate</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex flex-row items-center justify-center">
              <FaHeartbeat className="size-8 mr-2 text-[#2F80ED]" />
              <CardTitle className="font-bold text-[#0E313E] text-4xl">
                {patientVitals?.pulseRate}
              </CardTitle>
              <Label className="ml-1">bpm</Label>
            </CardContent>
          </Card>

          <Card className="drop-shadow-md">
            <CardHeader className="text-center">
              <CardDescription>Body Temperature</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex flex-row items-center justify-center">
              <FaThermometerHalf className="size-8 mr-2 text-[#2F80ED]" />
              <CardTitle className="font-bold text-[#0E313E] text-4xl">
                {patientVitals?.bodyTemperature}
              </CardTitle>
              <Label className="ml-1">°C</Label>
            </CardContent>
          </Card>

          <Card className="drop-shadow-md">
            <CardHeader className="text-center">
              <CardDescription>Oxygen Saturation</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex flex-row items-center justify-center">
              <FaFillDrip className="size-8 mr-2 text-[#2F80ED]" />
              <CardTitle className="font-bold text-[#0E313E] text-4xl">
                {patientVitals?.oxygen}
              </CardTitle>
              <Label className="ml-1">mm Hg</Label>
            </CardContent>
          </Card>

          <Card className="drop-shadow-md">
            <CardHeader className="text-center">
              <CardDescription>Weight</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex flex-row items-center justify-center">
              <FaClock className="size-8 mr-2 text-[#2F80ED]" />
              <CardTitle className="font-bold text-[#0E313E] text-4xl">
                {patientVitals?.weight}
              </CardTitle>
              <Label className="ml-1">kl</Label>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator className="col-span-2" />
      <Card className="drop-shadow-md col-span-2">
        <CardHeader>
          <CardTitle>Patient History</CardTitle>
          <CardDescription>View the patient&apos;s history</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="col-span-2 grid 2xl:grid-cols-3 grid-cols-2 grid-flow-row gap-8 gap-x-12">
            <div className="2xl:col-span-2 col-span-1 flex flex-col gap-2">
              <div className="flex shrink-0">
                <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                  Chief Complaint
                </Label>
              </div>
              <p className="text-wrap">{patientHist.chiefComplaint}</p>
            </div>

            <div className="col-span-1 flex flex-col gap-2">
              <div className="flex shrink-0">
                <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                  Referred By
                </Label>
              </div>
              <p className="text-wrap">{patientHist.referredBy}</p>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                History of Present Illness
              </Label>
            </div>
            <p className="text-wrap">{patientHist.historyOfPresentIllness}</p>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                Past Medical History
              </Label>
            </div>
            <p className="text-wrap">{patientHist.pastMedicalHistory}</p>
          </div>

          <Separator className="col-span-2 mb-4" />

          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                Family History
              </Label>
            </div>
            <p className="text-wrap">{patientHist.familyHistory}</p>
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                Personal, Social, and Emotional History
              </Label>
            </div>
            <p className="text-wrap">{patientHist.personalSocialHistory}</p>
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                OB-GYNE History
              </Label>
            </div>
            <p className="text-wrap">{patientHist.obgyneHistory}</p>
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                Neurological Examination
              </Label>
            </div>
            <p className="text-wrap">{patientHist.neurologicalExamination}</p>
          </div>

          <div className="2xl:col-span-2 col-span-1 flex flex-col gap-2">
            <div className="flex shrink-0">
              <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                Physical Examination
              </Label>
            </div>
            <p className="text-wrap">{patientHist.physicalExamination}</p>
          </div>
        </CardContent>
      </Card>
      <div className="col-span-2">
        {/* <PatientPlanView 
          recordId={patientHist.id} 
          patientId={patientHist.patientId} 
        /> */}
      </div>
    </div>
  );
};

export default PatientHistoryViewPageClientSide;
