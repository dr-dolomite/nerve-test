"use client";

import * as z from "zod";
import { useTransition, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactToPrint from "react-to-print";

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
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LaboratoryRequestSchema } from "@/schemas";

import { saveLabRequestForm } from "@/actions/plan-actions/save-lab-req";
import { fetchLabRequestPlan } from "@/actions/fetch-actions/fetch-lab";

import {
  ArrowRightIcon,
  CheckIcon,
  PenLineIcon,
  PrinterIcon,
} from "lucide-react";
import LabRequestFormPrintable from "@/components/printables/lab-req-form";

interface LabRequestFormProps {
  patientPlanId: string | null;
  patientId: string;
}

const LabRequestForm = ({ patientPlanId, patientId }: LabRequestFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isUpdate, setUpdate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const patientPlanIdValue = patientPlanId ?? "";

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
    {
      id: "18",
      label: "Fecalysis",
    },
    {
      id: "19",
      label: "SGOT",
    },
  ];

  const [formData, setFormData] = useState<z.infer<
    typeof LaboratoryRequestSchema
  > | null>(null);

  const form = useForm<z.infer<typeof LaboratoryRequestSchema>>({
    resolver: zodResolver(LaboratoryRequestSchema),
    defaultValues: {
      patientPlanId: patientPlanIdValue,
      dateToBeTaken: "",
      followUpDate: "",
      notes: "",
      laboratoryTests: [],
    },
  });

  useEffect(() => {
    if (patientPlanId) {
      startTransition(() => {
        fetchLabRequestPlan(patientPlanId)
          .then((data) => {
            if (data.error) {
              setError(data.error);
            }
            if (data.success && data.data) {
              form.reset(data.data);
              setFormData(data.data);
              setUpdate(true);
              console.log(data.data);
            }
          })
          .catch(() => {
            setError("Failed to fetch OPD plan data");
          });
      });
    }
  }, [patientPlanId, form]);

  const onSubmit = (values: z.infer<typeof LaboratoryRequestSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      saveLabRequestForm(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setFormData(values); // Store form data to pass to the printable component
            form.reset();
            setSuccess(data.success);
            setUpdate(true);
          }
        })
        .catch(() => {
          setError("An error occurred.");
        });
    });
  };

  const printableRef = useRef(null);

  return (
    <Card className="p-4 mt-6">
      <CardHeader>
        <CardTitle>Laboratory Request Form</CardTitle>
        <CardDescription>
          {patientPlanId
            ? "Update the existing OPD plan."
            : "Create a new OPD plan."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid 2xl:grid-cols-3 grid-cols-1 grid-flow-row gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="col-span-1 max-w-screen-md">
              <FormField
                control={form.control}
                name="dateToBeTaken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date to be Taken</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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

            <div className="col-span-1 max-w-screen-md">
              <FormField
                control={form.control}
                name="followUpDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow Up Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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

            <div className="col-span-3">
              <FormField
                control={form.control}
                name="laboratoryTests"
                render={() => (
                  <FormItem>
                    <div className="mb-6">
                      <FormLabel className="text-base">
                        Laboratory Tests
                      </FormLabel>
                      <FormDescription>
                        Select the items you want to include.
                      </FormDescription>
                    </div>
                    <div className="grid xl:grid-cols-3 grid-cols-1 2xl:gap-8 gap-6 grid-flow-row container mx-auto">
                      {labItems.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="laboratoryTests"
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
                                <FormLabel className="text-md font-normal">
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
            </div>

            <div className="2xl:col-span-3 col-span-1">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Others, specify</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type something here..."
                        disabled={isPending}
                        className="h-64"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col mt-4 col-span-3 gap-y-4">
              <div className="text-center">
                <FormError message={error} />
                <FormSuccess message={success} />
              </div>

              <div className="flex flex-row gap-x-12 mt-4">
                {!success && (
                  <Button
                    type="submit"
                    className="my-button-blue"
                    size="lg"
                    disabled={isPending}
                  >
                    {isUpdate
                      ? "Update laboratory Request Form"
                      : "Save Laboratory Request Form"}
                    {isUpdate ? (
                      <PenLineIcon className="size-4 ml-2" />
                    ) : (
                      <CheckIcon className="size-4 ml-2" />
                    )}
                  </Button>
                )}

                {success && (
                  <div className="grid 2xl:grid-cols-2 grid-cols-1 grid-flow-row gap-8">
                    <Button
                      type="submit"
                      className="my-button-blue"
                      size="lg"
                      disabled={isPending}
                    >
                      {isUpdate
                        ? "Update laboratory Request Form"
                        : "Save Laboratory Request Form"}
                      <ArrowRightIcon className="size-4 ml-2" />
                    </Button>

                    <div className="max-w-sm flex flex-row items-center gap-x-6">
                      <ReactToPrint
                        trigger={() => (
                          <Button
                            type="button"
                            className="my-button-blue"
                            size="lg"
                          >
                            Print Laboratory Request Form
                            <PrinterIcon className="size-4 ml-2" />
                          </Button>
                        )}
                        content={() => printableRef.current}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Hidden Printable Component */}
      {formData && (
        <div style={{ display: "none" }}>
          <LabRequestFormPrintable
            ref={printableRef}
            patientId={patientId!}
            dateToTaken={formData?.dateToBeTaken || ""}
            clinicFollowUp={formData?.followUpDate || ""}
            otherTests={formData?.notes || ""}
            selectedTests={formData?.laboratoryTests || []}
          />
        </div>
      )}
    </Card>
  );
};

export default LabRequestForm;
