"use client";
import * as z from "zod";
import { useTransition, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { PatientFollowUpsSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { savePatientFollowup } from "@/actions/save-followups";
import { fetchFollowUpdata } from "@/actions/fetch-actions/fetch-followup";

import { ArrowRight, HomeIcon } from "lucide-react";

const PatientFollowUpForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [patientFollowUpRecordId, setPatientFollowUpRecordId] = useState<
    string | undefined
  >("");
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const vitalSignsId = searchParams.get("vitalSignsId");

  const form = useForm<z.infer<typeof PatientFollowUpsSchema>>({
    resolver: zodResolver(PatientFollowUpsSchema),
    defaultValues: {
      patientId: patientId ?? undefined,
      vitalSignsId: vitalSignsId ?? undefined,
      labResults: "",
      chiefComplaint: "",
      so: "",
      diagnosis: "",
      treatment: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PatientFollowUpsSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      savePatientFollowup(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            setPatientFollowUpRecordId(data.followUpRecordId);
          }
        })
        .catch(() => {
          setError("An error occurred.");
        });
    });
  };

  if (!patientId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Vitals</CardTitle>
          <CardDescription>
            Fill up the form below to save patient follow-up data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col col-span-3 mt-4 gap-y-4">
            <div className="text-center">
              <FormError message="Patient ID is required." />
            </div>
            <div>
              <Button
                type="button"
                size="lg"
                className="my-button-blue"
                asChild
              >
                <Link href="/dashboard/home">
                  <HomeIcon className="size-4 mr-2" />
                  Go Back Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Vitals</CardTitle>
        <CardDescription>
          Fill up the form below to save patient vitals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid xl:grid-cols-2 grid-cols-1 grid-flow-row 2xl:gap-6 gap-4 w-full "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="labResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab Results</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here..."
                      disabled={!!isPending || !!success}
                      className="h-36 font-medium focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here..."
                      disabled={!!isPending || !!success}
                      className="h-36 font-medium focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="so"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SO</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here..."
                      disabled={!!isPending || !!success}
                      className="h-36 font-medium focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here..."
                      disabled={!!isPending || !!success}
                      className="h-36 font-medium focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here..."
                      disabled={!!isPending || !!success}
                      className="h-36 font-medium focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col col-span-2 mt-4 gap-y-4">
              <div className="text-center">
                <FormError message={error} />
                <FormSuccess message={success} />
              </div>

              <div>
                {!success && (
                  <Button
                    type="submit"
                    size="lg"
                    className="my-button-blue max-w-sm"
                    disabled={isPending}
                  >
                    Save Follow-up Data
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                )}

                {success && (
                  <div className="flex gap-6 items-center">
                    <Button
                      type="button"
                      asChild
                      className="my-button-blue"
                      size="lg"
                    >
                      <Link
                        href={`/dashboard/add-plan?patientId=${patientId}&recordId=${patientFollowUpRecordId}`}
                      >
                        Add Patient Plan Information
                        <ArrowRight className="size-4 ml-2" />
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      asChild
                      className="my-button-blue"
                      size="lg"
                    >
                      <Link href="/dashboard/home">
                        <HomeIcon className="size-4 mr-2" />
                        Go Back Home
                      </Link>
                    </Button>
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

export default PatientFollowUpForm;
