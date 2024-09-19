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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Textarea } from "@/components/ui/textarea";
import { OPDPlanSchema } from "@/schemas";

import { saveOPDPlan } from "@/actions/plan-actions/save-opd-plan";
import { fetchOPDPlan } from "@/actions/fetch-actions/fetch-opd";

import Link from "next/link";
import { ArrowRightIcon, Check, CheckIcon, PenLineIcon, PrinterIcon } from "lucide-react";
import OPDPrintableComponent from "@/components/printables/opd-form";

interface OPDPlanPageProps {
  patientPlanId: string | null;
  patientId: string;
}

const OPDPlanPage = ({ patientPlanId, patientId }: OPDPlanPageProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isUpdate, setUpdate] = useState(false)
  const [isPending, startTransition] = useTransition();
  const patientPlanIdValue = patientPlanId ?? "";

  const [formData, setFormData] = useState<z.infer<
    typeof OPDPlanSchema
  > | null>(null);

  const form = useForm<z.infer<typeof OPDPlanSchema>>({
    resolver: zodResolver(OPDPlanSchema),
    defaultValues: {
      patientPlanId: patientPlanIdValue,
      nextVisit: "",
      diagnosis: "",
      medication: "",
      OPDNotes: "",
    },
  });

  useEffect(() => {
    if (patientPlanId) {
      startTransition(() => {
        fetchOPDPlan(patientPlanId)
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

  const onSubmit = (values: z.infer<typeof OPDPlanSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      saveOPDPlan(values)
        .then((data) => {
          if (data?.error) {
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
    <Card className="p-4 mt-6">
      <CardHeader>
        <CardTitle>Patient OPD Plan</CardTitle>
        <CardDescription>
        {patientPlanId ? "Update the existing OPD plan." : "Create a new OPD plan."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid 2xl:grid-cols-3 grid-cols-1 grid-flow-row gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="2xl:col-span-3 col-span-1 max-w-screen-md">
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

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
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
                    <FormLabel>Medication</FormLabel>
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
                    <FormLabel>Special Notes for OPD</FormLabel>
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
                    {isUpdate ? "Update OPD Plan Record" : "Save OPD Plan Record"}
                    {isUpdate ? <PenLineIcon className="size-4 ml-2" /> : <CheckIcon className="size-4 ml-2" />}
                  </Button>
                )}

                {success && (
                  <div className="grid grid-cols-1 grid-flow-row gap-8">
                    <div className="max-w-sm flex flex-row items-center gap-x-6">
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
            nextVisit={formData?.nextVisit || ""}
            diagnosis={formData?.diagnosis || ""}
            medication={formData?.medication || ""}
            OPDNotes={formData?.OPDNotes || ""}
          />
        </div>
      )}
    </Card>
  );
};

export default OPDPlanPage;
