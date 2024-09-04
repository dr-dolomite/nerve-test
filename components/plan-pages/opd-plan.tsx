"use client";

import * as z from "zod";
import { useTransition, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Textarea } from "@/components/ui/textarea";
import { OPDPlanSchema } from "@/schemas";
import { saveOPDPlan } from "@/actions/plan-actions/save-opd-plan";
import Link from "next/link";
import { Label } from "../ui/label";
import { ArrowRight, Check, PrinterIcon } from "lucide-react";

import OPDPrintableComponent from "@/components/printables/opd-form";

const OPDPlanPage = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const recordId = searchParams.get("id");
  const showContent = success || error === "Follow-up plan already exists.";

  const form = useForm<z.infer<typeof OPDPlanSchema>>({
    resolver: zodResolver(OPDPlanSchema),
    defaultValues: {
      patientId: patientId ?? "",
      recordId: recordId ?? "",
      nextVisit: "",
      diagnosis: "",
      medication: "",
      OPDNotes: "",
    },
  });

  const [formData, setFormData] = useState<z.infer<typeof OPDPlanSchema> | null>(null);

  const onSubmit = (values: z.infer<typeof OPDPlanSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      saveOPDPlan(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            setFormData(values); // Store form data to pass to the printable component
            form.reset();
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("An error occurred.");
        });
    });
  };

  const printableRef = useRef(null);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Patient OPD Plan</CardTitle>
        <CardDescription>
          Fill up the form below to save the plan for the previous record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid grid-cols-1 grid-flow-row gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="col-span-1 max-w-screen-md">
              <FormField
                control={form.control}
                name="nextVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Schedule Next Visit
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Referral name"
                        type="date"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Diagnosis
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your follow up notes here ..."
                        disabled={isPending}
                        className="h-64"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="medication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Medication
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your follow up notes here ..."
                        disabled={isPending}
                        className="h-64"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="col-span-1">
              <FormField
                control={form.control}
                name="OPDNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Special Notes for OPD
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your follow up notes here ..."
                        disabled={isPending}
                        className="h-64"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col mt-4 col-span-1 gap-y-4">
              <div className="text-center">
                <FormError message={error} />
                <FormSuccess message={success} />
              </div>

              <div className="flex flex-row gap-x-12 mt-4">
                {!success && error !== "Follow-up plan already exists." && (
                  <Button
                    type="submit"
                    className="my-button-blue"
                    size="lg"
                    disabled={isPending}
                  >
                    Save Patient Record
                  </Button>
                )}

                {showContent && (
                  <div className="grid grid-cols-1 grid-flow-row gap-8">
                    <div className="max-w-sm flex flex-row items-center gap-x-6">
                      <Button
                        type="button"
                        className="my-button-blue"
                        size="lg"
                        asChild
                      >
                        <Link href="/dashboard/home">
                          Done
                          <Check className="size-4 ml-2" />
                        </Link>
                      </Button>

                      <ReactToPrint
                        trigger={() => (
                          <Button
                            type="button"
                            className="my-button-blue"
                            size="lg"
                          >
                            Print The Plan
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
          <OPDPrintableComponent
            ref={printableRef}
            patientId={patientId!}
            nextVisit={formData.nextVisit}
            diagnosis={formData.diagnosis}
            medication={formData.medication}
            OPDNotes={formData.OPDNotes || ""}
          />
        </div>
      )}
    </Card>
  );
};

export default OPDPlanPage;
