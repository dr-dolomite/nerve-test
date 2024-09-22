"use client";

import * as z from "zod";
import { useTransition, useState, useEffect, useCallback } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  ArrowRight,
  PaperclipIcon,
  CheckIcon,
  PenLineIcon,
  Trash2Icon,
  NotepadText,
} from "lucide-react";

import { PatientPlanSchema } from "@/schemas";
import { savePatientPlan } from "@/actions/plan-actions/save-patient-plan";
import { updatePatientPlan } from "@/actions/plan-actions/update-patient-plan";
import { fetchPlanDetails } from "@/actions/fetch-actions/fetch-plan-details";
import TreatmentPlanForm from "@/components/plan-pages/treatment-form";
import LabRequestForm from "@/components/plan-pages/lab-request-form";
import { deletePatientPlan } from "@/actions/plan-actions/delete/delete-patient-plan";

interface PlanInformationPageProps {
  existingPlanId: string | null;
}

const PlanInformationPage = ({ existingPlanId }: PlanInformationPageProps) => {
  // TODO: Queue and add new patient

  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get("patientId") ?? "";
  const recordId = searchParams.get("recordId") ?? "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [planId, setPlanId] = useState<string | null>(null);
  const [medication, setMedication] = useState<string | undefined>(undefined);
  const [nextVisit, setNextVisit] = useState<string | undefined>(undefined);
  const [specialNotes, setSpecialNotes] = useState<string | undefined>(
    undefined
  );
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const pathName = usePathname();
  const currentPath = pathName;

  const form = useForm<z.infer<typeof PatientPlanSchema>>({
    resolver: zodResolver(PatientPlanSchema),
    defaultValues: {
      planId: "",
      patientId: patientId ?? "",
      recordId: recordId ?? "",
      nextVisit: "",
      specialNotes: "",
      medication: "",
      planItems: [],
    },
  });

  const onUpdate = (values: z.infer<typeof PatientPlanSchema>) => {
    if (!planId) {
      setError("Plan ID not initialized. Please try again.");
      return;
    }

    setError("");
    setSuccess("");

    // Construct updatedValues without undefined or empty values
    const updatedValues: any = {
      ...values,
      planId,
    };

    if (specialNotes) {
      updatedValues.specialNotes = specialNotes;
    }

    if (nextVisit) {
      updatedValues.nextVisit = nextVisit;
    }

    if (medication) {
      updatedValues.medication = medication;
    }

    startTransition(() => {
      updatePatientPlan(updatedValues)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("An error occurred.");
        });
    });
  };

  const onReset = () => {
    deletePatientPlan(planId ?? "", recordId)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data?.success) {
          setSuccess(data.success);
          setIsDeleted(true);
          // Reset state variables
          setMedication(undefined);
          setNextVisit(undefined);
          setSpecialNotes(undefined);
          setPlanId(null);
          setIsUpdated(false);
          form.reset({
            planId: "",
            patientId: patientId ?? "",
            recordId: recordId ?? "",
            nextVisit: "",
            specialNotes: "",
            medication: "",
            planItems: [],
          });
          router.refresh();
        }
      })
      .catch(() => {
        setError("An error occurred.");
      });
  };

  const fetchPlanDetailsAndSetFields = useCallback(
    async (planId: string) => {
      const data = await fetchPlanDetails(planId);

      if (data?.error) {
        setError(data.error);
      } else if (data?.success && data.data) {
        const { medication, specialNotes, nextVisit, planItems } = data.data;
        setMedication(medication);
        setSpecialNotes(specialNotes);
        setNextVisit(nextVisit);
        form.reset({
          planId,
          patientId,
          recordId,
          nextVisit,
          specialNotes,
          medication,
          planItems,
        });

        // Automatically check the plan items
        form.setValue("planItems", planItems);

        // Set the updated state to true if planItems is not empty
        if (planItems.length > 0) {
          setIsUpdated(true);
        }
      }
    },
    [form, patientId, recordId]
  );

  useEffect(() => {
    const initializePlan = async () => {
      if (existingPlanId) {
        // Use existing plan ID if available
        setPlanId(existingPlanId);
        await fetchPlanDetailsAndSetFields(existingPlanId);
      } else if (!planId) {
        try {
          const data = await savePatientPlan({
            patientId,
            recordId,
            planId: "",
            planItems: [],
            nextVisit: "",
            specialNotes: "",
            medication: "",
          });

          if (data?.error) {
            setError(data.error);
          } else if (data?.success && data.planId) {
            setPlanId(data.planId);
            await fetchPlanDetailsAndSetFields(data.planId);
          }
        } catch (error) {
          setError("An error occurred.");
        }
      }
    };
    initializePlan();
  }, [
    patientId,
    recordId,
    planId,
    existingPlanId,
    fetchPlanDetailsAndSetFields,
  ]);

  const selectedPlanItems = form.watch("planItems");

  const planItems = [
    {
      id: "1",
      label: "Laboratory Request",
      formPage: <LabRequestForm patientId={patientId} patientPlanId={planId} />,
      description: "Add a laboratory request",
    },
    {
      id: "2",
      label: "Treatment",
      formPage: (
        <TreatmentPlanForm patientId={patientId} patientPlanId={planId ?? ""} />
      ),
      description: "Add a treatment form",
    },
    {
      id: "3",
      label: "Follow-up on",
      formPage: (
        <div className="mb-12">
          <FormField
            control={form.control}
            name="nextVisit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Next Visit</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={nextVisit ?? ""}
                    onChange={(e) => setNextVisit(e.target.value)}
                    placeholder="Referral name"
                    type="date"
                    disabled={isPending}
                    className="max-w-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      description: "Add a follow-up date",
    },
    {
      id: "4",
      label: "Refer to",
      formPage: null,
      description: "Add a referral form",
    },
    {
      id: "5",
      label: "Medical Certificate",
      formPage: null,
      description: "Add a medical certificate",
    },
    {
      id: "6",
      label: "Cardio Pulmonary Clearance",
      formPage: null,
      description: "Add a cardio pulmonary clearance form",
    },
    {
      id: "7",
      label: "Neuro Clearance",
      formPage: null,
      description: "Add a neuro clearance form",
    },
    {
      id: "8",
      label: "Admission Request",
      formPage: null,
      description: "Add an admission request form",
    },
    {
      id: "9",
      label: "Special Notes",
      formPage: (
        <FormField
          control={form.control}
          name="specialNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={specialNotes ?? ""}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Type your notes here ..."
                  disabled={isPending}
                  className="h-64"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
      description: "Add special notes",
    },
  ];

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Patient Plan Form</CardTitle>
        <CardDescription>Fill in the information below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdate)}>
            <FormField
              control={form.control}
              name="planItems"
              render={() => (
                <FormItem>
                  <div className="mb-6">
                    <FormLabel className="text-base">Patient Plan</FormLabel>
                    <FormDescription>
                      Select the items you want to include.
                    </FormDescription>
                  </div>
                  <div className="grid xl:grid-cols-3 grid-cols-1 gap-4 grid-flow-row container mx-auto">
                    {planItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="planItems"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, item.id]
                                      : field.value?.filter(
                                          (value) => value !== item.id
                                        );
                                    field.onChange(updatedValue);
                                    form.setValue("planItems", updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid 2xl:grid-cols-3 grid-cols-1 grid-flow-row gap-3 2xl:mt-12 mt-8">
              {planItems
                .filter((item) => selectedPlanItems.includes(item.id))
                .map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
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
                            {item.formPage}
                          </SheetContent>
                          <div className="grid gap-1 xs:hidden">
                            <p className="2xl:text-sm text-xs font-medium leading-none">
                              {item.label}
                            </p>
                            <p className="2xl:text-sm text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Sheet>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="flex flex-col col-span-3 mt-4 gap-y-4">
              <div className="text-center">
                <FormError message={error} />
                <FormSuccess message={success} />
              </div>

              <div>
                {!success && (
                  <div className="flex gap-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="my-button-blue"
                      disabled={isPending || selectedPlanItems.length === 0}
                    >
                      {isUpdated ? "Update" : "Save"} Patient Plan
                      {isUpdated ? (
                        <PenLineIcon className="ml-2 size-4" />
                      ) : (
                        <CheckIcon className="ml-2 size-4" />
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={onReset}
                      size="lg"
                      className="my-button-red"
                      disabled={isPending || selectedPlanItems.length === 0}
                    >
                      Reset All Plan Items
                      <Trash2Icon className="ml-2 size-4" />
                    </Button>
                  </div>
                )}

                {success && (
                  <div className="flex gap-6">
                    <Button
                      type="submit"
                      size="lg"
                      className="my-button-blue"
                      disabled={isPending || isDeleted}
                    >
                      Update Patient Plan
                      <PenLineIcon className="ml-2 size-4" />
                    </Button>

                    {!currentPath.startsWith(
                      "/dashboard/records/view-patient-record"
                    ) && (
                      <Button
                        type="button"
                        size="lg"
                        asChild
                        disabled={isPending || isDeleted}
                        className="my-button-blue"
                      >
                        <Link href={`/dashboard/home`}>
                          Done
                          <CheckIcon className="ml-2 size-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlanInformationPage;
