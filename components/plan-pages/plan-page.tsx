"use client";

import * as z from "zod";
import { useTransition, useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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
import { XIcon, ArrowRight, PaperclipIcon, CheckIcon } from "lucide-react";

import { PatientPlanSchema } from "@/schemas";
import { savePatientPlan } from "@/actions/plan-actions/save-patient-plan";
import { updatePatientPlan } from "@/actions/plan-actions/update-patient-plan";
import { fetchOPDPlan } from "@/actions/fetch-actions/fetch-opd";
import OPDPlanPage from "@/components/plan-pages/opd-plan";
import LabRequestForm from "@/components/plan-pages/lab-request-form";

const PlanInformationPage = () => {
  const planItems = [
    {
      id: "1",
      label: "Laboratory Request",
    },
    {
      id: "2",
      label: "Treatment",
    },
    {
      id: "3",
      label: "Follow-up on",
    },
    {
      id: "4",
      label: "Refer to",
    },
    {
      id: "5",
      label: "Medical Certificate",
    },
    {
      id: "6",
      label: "Cardio Pulmonary Clearance",
    },
    {
      id: "7",
      label: "Neuro Clearance",
    },
    {
      id: "8",
      label: "OPD",
    },
    {
      id: "9",
      label: "Notes",
    },
  ];

  // TODO: Retain the checked items even if redirected to another page. Also, change the paperclip icon to a different icon like checkmark when the form was already filled out.

  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? "";
  const recordId = searchParams.get("recordId") ?? "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [planId, setPlanId] = useState<string | null>(null);
  const [hasOPDPlan, setHasOPDPlan] = useState(false);

  const checkOPDPlanExistence = async (planId: string) => {
    try {
      const result = await fetchOPDPlan(planId);
      const opdPlanExists = !!result.success;
      setHasOPDPlan(opdPlanExists);

      // Auto-check the OPD checkbox if the plan exists
      if (opdPlanExists) {
        const currentPlanItems = form.getValues("planItems");
        if (!currentPlanItems.includes("8")) {
          form.setValue("planItems", [...currentPlanItems, "8"]);
        }
      }
    } catch (error) {
      console.error("Error checking OPD plan existence:", error);
      setHasOPDPlan(false);
    }
  };

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

  useEffect(() => {
    if (!planId) {
      startTransition(() => {
        savePatientPlan({
          patientId,
          recordId,
          planId: "",
          planItems: [],
          nextVisit: "",
          specialNotes: "",
          medication: "",
        })
          .then((data) => {
            if (data?.error) {
              setError(data.error);
            } else if (data?.success && data.planId) {
              setPlanId(data.planId);
              checkOPDPlanExistence(data.planId);
            }
          })
          .catch(() => {
            setError("An error occurred.");
          });
      });
    } else {
      checkOPDPlanExistence(planId);
    }
  }, [patientId, recordId, planId]); // !ESLint warning to fix

  const onUpdate = (values: z.infer<typeof PatientPlanSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      updatePatientPlan(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("An error occurred.");
        });
    });
  };

  const selectedPlanItems = form.watch("planItems");

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
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
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
              {selectedPlanItems?.includes("1") && (
                <Card>
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
                          <LabRequestForm
                            patientId={patientId}
                            patientPlanId={planId}
                          />
                        </SheetContent>
                        <div className="grid gap-1 xs:hidden">
                          <p className="2xl:text-sm text-xs font-medium leading-none">
                            Laboratory Request Form
                          </p>
                          <p className="2xl:text-sm text-xs text-muted-foreground">
                            Fill out the laboratory request form
                          </p>
                        </div>
                      </div>
                    </Sheet>
                  </CardContent>
                </Card>
              )}

              {selectedPlanItems?.includes("2") && (
                <Card>
                  <CardContent className="p-4">
                    <Sheet>
                      <div className="flex items-center gap-6">
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            <PaperclipIcon className="size-6 text-[#2F80ED]" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                          <SheetHeader>
                            <SheetTitle>Treatment</SheetTitle>
                            <SheetDescription>
                              Add a medication
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-8">
                            <FormField
                              control={form.control}
                              name="medication"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Medication</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder="Type your notes here ..."
                                      disabled={isPending}
                                      className="h-64"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </SheetContent>
                        <div className="grid gap-1 xs:hidden">
                          <p className="2xl:text-sm text-xs font-medium leading-none">
                            Additional Medication
                          </p>
                          <p className="2xl:text-sm text-xs text-muted-foreground">
                            Add a medication
                          </p>
                        </div>
                      </div>
                    </Sheet>
                  </CardContent>
                </Card>
              )}

              {selectedPlanItems?.includes("3") && (
                <Card>
                  <CardContent className="p-4">
                    <Sheet>
                      <div className="flex items-center gap-6">
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            <PaperclipIcon className="size-6 text-[#2F80ED]" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                          <SheetHeader>
                            <SheetTitle>Follow Up on</SheetTitle>
                            <SheetDescription>
                              Add a follow up date
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-8">
                            <FormField
                              control={form.control}
                              name="nextVisit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Schedule Next Visit</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
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
                        </SheetContent>
                        <div className="grid gap-1 xs:hidden">
                          <p className="2xl:text-sm text-xs font-medium leading-none">
                            Follow-up On
                          </p>
                          <p className="2xl:text-sm text-xs text-muted-foreground">
                            Add a follow up date
                          </p>
                        </div>
                      </div>
                    </Sheet>
                  </CardContent>
                </Card>
              )}

              {selectedPlanItems?.includes("8") && (
                <Card>
                  <CardContent className="p-4">
                    <Sheet
                      onOpenChange={(open) => {
                        if (!open && planId) {
                          checkOPDPlanExistence(planId);
                        }
                      }}
                    >
                      <div className="flex items-center gap-6">
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            {hasOPDPlan ? (
                              <CheckIcon className="size-6 text-green-500" />
                            ) : (
                              <PaperclipIcon className="size-6 text-[#2F80ED]" />
                            )}
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side="bottom"
                          className="max-h-[90%] overflow-y-auto"
                        >
                          <OPDPlanPage
                            patientId={patientId}
                            patientPlanId={planId}
                          />
                        </SheetContent>
                        <div className="grid gap-1 xs:hidden">
                          <p className="2xl:text-sm text-xs font-medium leading-none">
                            OPD
                          </p>
                          <p className="2xl:text-sm text-xs text-muted-foreground">
                            Add an OPD plan
                          </p>
                        </div>
                      </div>
                    </Sheet>
                  </CardContent>
                </Card>
              )}

              {selectedPlanItems?.includes("9") && (
                <Card>
                  <CardContent className="p-4">
                    <Sheet>
                      <div className="flex items-center gap-6">
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            <PaperclipIcon className="size-6 text-[#2F80ED]" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                          <SheetHeader>
                            <SheetTitle>Additional Notes</SheetTitle>
                            <SheetDescription>
                              Add an additional note
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-8">
                            <FormField
                              control={form.control}
                              name="specialNotes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Notes</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder="Type your notes here ..."
                                      disabled={isPending}
                                      className="h-64"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </SheetContent>
                        <div className="grid gap-1 xs:hidden">
                          <p className="2xl:text-sm text-xs font-medium leading-none">
                            Additional Notes
                          </p>
                          <p className="2xl:text-sm text-xs text-muted-foreground">
                            Add an additional note
                          </p>
                        </div>
                      </div>
                    </Sheet>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex flex-col col-span-3 mt-4 gap-y-4">
              <div className="text-center">
                <FormError message={error} />
                <FormSuccess message={success} />
              </div>

              <div>
                {!success && (
                  <Button
                    type="submit"
                    size="lg"
                    className="my-button-blue"
                    disabled={isPending || selectedPlanItems.length === 0}
                  >
                    Save Patient Plan
                  </Button>
                )}

                {success && (
                  <Button
                    type="button"
                    size="lg"
                    asChild
                    className="my-button-blue"
                  >
                    <Link
                      href={`/dashboard/add-patient-vitals?patientId=${patientId}`}
                    >
                      Add Patient Vitals
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
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
