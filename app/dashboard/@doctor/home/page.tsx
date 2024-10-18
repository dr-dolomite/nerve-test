"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { getPatientById } from "@/data/get-patient-info";
import { getActiveQueueId } from "@/actions/fetch-actions/fetch-current-queue";
import { handleNextPatient } from "@/actions/queue/hande-next-patient";
import { fetchCurrentQueueState } from "@/actions/queue/fetch-current-patient";
import { getPatientHistoryById } from "@/data/get-patient-info";
import { getPatientVitalsById } from "@/data/get-patient-info";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowRightIcon, BookText, IterationCw, User2Icon } from "lucide-react";

import PatientHistoryViewPageClientSide from "@/components/client-view/patient-history-view";
import FollowUpListPageClientSide from "@/components/client-view/follow-up-list";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FaClock,
  FaFillDrip,
  FaThermometerHalf,
  FaHeartbeat,
} from "react-icons/fa";

interface Patient {
  id: string;
  name: string;
  imageURL: string | null;
  age: number;
  city: string | null;
  completeAddress: string | null;
  civilStatus: string | null;
  isNewPatient: boolean;
  handedness: string | null;
  occupation: string | null;
  sex: string | null;
  birthday: Date | null;
  religion: string | null;
  email: string | null;
  phone: string | null;
  lastVisit: Date | null;
}

interface PatientHistory {
  referredBy: string | null;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  familyHistory: string;
  personalSocialHistory: string;
  obgyneHistory: string | null;
  physicalExamination: string;
  neurologicalExamination: string | null;
  diagnosis: string | null;
  labResults: string | null;
  vitalSignsid: string;
}

interface Vitals {
  weight: string;
  pulseRate: number;
  bodyTemperature: string;
  bloodPressure: string;
  oxygen: number;
}

const DoctorHomePage = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.toLocaleString("default", { weekday: "long" });
  const year = currentDate.getFullYear();
  const dayOfMonth = currentDate.getDate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentPatientHistory, setCurrentPatientHistory] =
    useState<PatientHistory | null>(null);
  const [currentPatientVitals, setCurrentPatientVitals] =
    useState<Vitals | null>(null);
  const [remainingPatients, setRemainingPatients] = useState<number>(0);
  const user = useCurrentUser();

  const { toast } = useToast();

  // Fetch initial patient data
  useEffect(() => {
    const fetchInitialState = async () => {
      setIsFetching(true);

      try {
        const queueId = await getActiveQueueId();
        if (!queueId) {
          toast({
            variant: "destructive",
            title: "No active queue found",
            description: "Please wait for the clerk to create a queue.",
          });
          return;
        }

        const queueState = await fetchCurrentQueueState(queueId);
        if (queueState.success && queueState.patientId) {
          const patientData = await getPatientById(queueState.patientId);
          const patientHistory = await getPatientHistoryById(
            queueState.patientId
          );
          if (patientData) {
            setCurrentPatient(patientData);
            setRemainingPatients(queueState.remainingPatients);
          }

          if (patientHistory) {
            setCurrentPatientHistory(patientHistory);
            const vitals = await getPatientVitalsById(
              patientHistory.vitalSignsid
            );
            if (vitals) {
              setCurrentPatientVitals(vitals);
            }
          }

          setIsFetching(false);
        } else {
          setIsFetching(false);
          setCurrentPatient(null);
          setRemainingPatients(queueState.remainingPatients);
        }
      } catch (error) {
        console.error("Error fetching initial state:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch queue state",
        });
      }
    };

    fetchInitialState();
  }, [toast]);

  const onNextPatient = async () => {
    try {
      setIsProcessing(true);
      const queueId = await getActiveQueueId();

      if (!queueId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No active queue found",
        });
        return;
      }

      const result = await handleNextPatient(queueId);

      if (result.success) {
        if (result.patientId) {
          const patientData = await getPatientById(result.patientId);
          if (patientData) {
            setCurrentPatient(patientData);
            setRemainingPatients((prev) => Math.max(0, prev - 1));
            toast({
              title: "Success",
              description: "Next patient ready",
            });
          }
        } else {
          setCurrentPatient(null);
          setRemainingPatients(0);
          toast({
            title: "Information",
            description: "No more patients in queue",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error processing next patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process next patient",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row justify-between content-center">
          <CardTitle>Welcome Dr. {user?.name}</CardTitle>
          <CardContent>
            <CardDescription>
              {day} {month} {dayOfMonth}, {year}
            </CardDescription>
          </CardContent>
        </CardHeader>
        <CardContent className="flex flex-row justify-between content-center items-center">
          <h1 className="text-md font-semibold">
            Remaining Patients: {remainingPatients}
          </h1>
          <Button
            variant="default"
            className="my-button-blue"
            onClick={onNextPatient}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Next Patient"}
            <ArrowRightIcon className="ml-2 size-5" />
          </Button>
        </CardContent>
      </Card>

      <Card className={currentPatient ? "visible" : "hidden"}>
        {currentPatient && (
          <CardContent className="grid 2xl:grid-cols-4 grid-cols-1 grid-flow-row gap-8 p-8 min-h-[800px]">
            <div className="col-span-1 grid gap-6 2xl:gap-y-12 max-h-[400px]">
              <div className="flex flex-row gap-x-8 items-center">
                <Avatar className="size-24">
                  <AvatarImage src={""} />
                  <AvatarFallback>
                    <User2Icon className="size-16" />
                  </AvatarFallback>
                </Avatar>

                <div className="grid">
                  <h3 className="text-lg font-semibold">
                    {currentPatient.name}
                  </h3>
                  <p className="text-sm text-gray">{currentPatient.id}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex flex-col gap-2 mb-8">
                  <p className="text-md font-semibold">Chief Complaint:</p>
                  <p className="text-md capitalize">
                    {currentPatientHistory?.chiefComplaint}
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">Age:</p>
                  <p className="text-md">{currentPatient.age}</p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">Address:</p>
                  <p className="text-md capitalize">
                    {currentPatient.completeAddress}
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">City:</p>
                  <p className="text-md capitalize">{currentPatient.city}</p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">Handedness</p>
                  <p className="text-md capitalize">
                    {currentPatient.handedness}
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">Civil Status:</p>
                  <p className="text-md capitalize">
                    {currentPatient.civilStatus}
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">Religion:</p>
                  <p className="text-md capitalize">
                    {currentPatient.religion}
                  </p>
                </div>

                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">Occupation:</p>
                  <p className="text-md capitalize">
                    {currentPatient.occupation}
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <p className="text-md font-semibold">Last Visit:</p>
                <p className="text-md capitalize">
                  {currentPatient.lastVisit?.toDateString()}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <div className="grid gap-y-6">
                <div>
                  <Tabs
                    defaultValue="history"
                    className="relative mr-auto w-full"
                  >
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                      <TabsTrigger
                        value="history"
                        className="relative data-[state=active]:bg-none rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                      >
                        <BookText className="size-4 mr-2" />
                        History
                      </TabsTrigger>
                      <TabsTrigger
                        value="followUp"
                        className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                      >
                        <IterationCw className="size-4 mr-2" />
                        Follow Up
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="history">
                      {currentPatientHistory && (
                        <PatientHistoryViewPageClientSide
                          patientId={currentPatient?.id}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="followUp">
                      <FollowUpListPageClientSide patientId={currentPatient?.id} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {isFetching && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              Fetching next patient...
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {!currentPatient && !isFetching && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              No patient currently in consultation
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default DoctorHomePage;
