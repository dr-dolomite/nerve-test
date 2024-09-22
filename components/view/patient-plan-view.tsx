import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getPatientPlanByRecordId } from "@/data/get-patient-info";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditIcon, PaperclipIcon } from "lucide-react";

import LabRequestForm from "@/components/plan-pages/lab-request-form";
import TreatmentPlanForm from "@/components/plan-pages/treatment-form";
// import EditPatientPlan from "../edit/edit-patient-plan";
import PlanInformationPage from "../plan-pages/plan-page";

interface PatientPlanViewProps {
  recordId: string;
}

const PatientPlanView = async ({ recordId }: PatientPlanViewProps) => {
  const patientPlanDetails = await getPatientPlanByRecordId(recordId);
  // console.log(patientPlanDetails);

  if (recordId === "" || !recordId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Plan</CardTitle>
          <CardDescription>View the patient&apos;s plan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-md">No record found</p>
        </CardContent>
      </Card>
    );
  }

  //   Convert next visit date time to string
  const nextVisitDate = patientPlanDetails?.nextVisit
    ? new Date(patientPlanDetails?.nextVisit).toDateString()
    : "No date provided";
  const currentPlan = patientPlanDetails?.planItems || [];

  const planItems = [
    {
      id: "1",
      label: "Laboratory Request",
      pageToRender: (
        <LabRequestForm
          patientId={patientPlanDetails?.patientId ?? ""}
          patientPlanId={patientPlanDetails?.id ?? ""}
        />
      ),
    },
    {
      // Exclude
      id: "2",
      label: "Treatment",
      pageToRender: (
        <TreatmentPlanForm
          patientId={patientPlanDetails?.patientId ?? ""}
          patientPlanId={patientPlanDetails?.id ?? ""}
        />
      ),
    },
    {
      // Exclude
      id: "3",
      label: "Follow-up on",
    },
    {
      id: "4",
      label: "Refer to",
      pageToRender: null,
    },
    {
      id: "5",
      label: "Medical Certificate",
      pageToRender: null,
    },
    {
      id: "6",
      label: "Cardio Pulmonary Clearance",
      pageToRender: null,
    },
    {
      id: "7",
      label: "Neuro Clearance",
      pageToRender: null,
    },
    {
      id: "8",
      label: "Admission Request",
    },
    {
      // Exclude
      id: "9",
      label: "Notes",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Patient Plan</CardTitle>
          <Dialog>
            <DialogTrigger>
              <EditIcon className="size-5 text-gray cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="2xl:max-w-[80%] max-w-[90%]">
              <DialogHeader>
                <DialogTitle>Edit Patient Plan</DialogTitle>
              </DialogHeader>
              <PlanInformationPage existingPlanId={patientPlanDetails?.id ?? null} />
            </DialogContent>
          </Dialog>
        </div>

        <CardDescription>View the patient&apos;s plan</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex flex-col gap-2 ">
          <div className="flex shrink-0">
            <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
              Follow Up Date
            </Label>
          </div>
          <p className="text-wrap font-semibold text-md">{nextVisitDate}</p>
        </div>

        <div className="grid gap-3">
          <div className="flex shrink-0">
            <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
              Special Notes
            </Label>
          </div>
          <Textarea className="h-32">
            {patientPlanDetails?.followUpNotes ||
              "No special notes was provided"}
          </Textarea>
          {/* <p className="text-wrap">
            {patientPlanDetails?.followUpNotes || "No special notes"}
          </p> */}
        </div>

        <div className="grid gap-3">
          <div className="flex shrink-0">
            <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
              Attachments
            </Label>
          </div>
          <div className="grid grid-flow-row grid-cols-3 gap-4">
            {/* If the index is present at plan items then use planItems to get its name */}
            {currentPlan
              .filter((item) => !["3", "9"].includes(item))
              .map((item) => (
                <div key={item} className="flex flex-col gap-2">
                  <Card className="p-4">
                    <Sheet>
                      <div className="flex items-center gap-6">
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            <PaperclipIcon className="size-6 text-[#2F80ED]" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side="bottom"
                          className="max-h-[90%] overflow-y-auto"
                        >
                          {planItems[parseInt(item) - 1].pageToRender}
                        </SheetContent>
                        <div className="grid gap-1 xs:hidden">
                          <p className="2xl:text-md text-sm font-semibold leading-none">
                            {planItems[parseInt(item) - 1].label}
                          </p>
                          <p className="2xl:text-sm text-xs text-muted-foreground">
                            View Attachment
                          </p>
                        </div>
                      </div>
                    </Sheet>
                  </Card>
                  {/* <Label className="font-semibold bg-[#2F80ED] p-2 text-white">
                {planItems[parseInt(item) - 1].label}
                </Label> */}
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientPlanView;
