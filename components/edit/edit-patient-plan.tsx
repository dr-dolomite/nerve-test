"use client";

import * as z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useState,
    useEffect,
    useTransition
} from "react";

import { getPatientPlanById } from "@/data/get-patient-info";
import { PatientPlanSchema } from "@/schemas";

import { useRouter } from "next/navigation";

interface EditPatientInformationPageProps {
    planId: string
}

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { updatePatientPlanNotesAndDate } from "@/actions/update/update-patient-plan-view";
import { PenLineIcon } from "lucide-react";


const EditPatientPlan = ({ planId }: EditPatientInformationPageProps) => {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof PatientPlanSchema>>({
        resolver: zodResolver(PatientPlanSchema),
        defaultValues: {
            nextVisit: "",
            specialNotes: "",
            planId: planId,
        },
    });

    useEffect(() => {
        getPatientPlanById(planId).then((data) => {
            if (data) {
                form.reset({
                    nextVisit: data.nextVisit?.toDateString() ?? undefined,
                    specialNotes: data.followUpNotes ?? undefined,
                });
            }

        })
    }, [planId, form])

    const onSubmit = async (values: z.infer<typeof PatientPlanSchema>) => {
        try {
            setError('');
            setSuccess('');

            startTransition(() => {
                updatePatientPlanNotesAndDate(values)
                    .then((data) => {
                        if (data?.error) {
                            form.reset();
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
                router.refresh();
            });
        } catch (error) {
            console.error('Error in form submission:', error);
            setError('An error occurred.');
        }
    };

    return (
        <Form {...form}>
            <form className="grid grid-cols-1 grid-flow-row gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="max-w-sm col-span-1">
                    <FormField
                        control={form.control}
                        name="nextVisit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Follow-up Date
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={!!isPending || !!success}
                                        type="date"
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
                        name="specialNotes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                Special Notes
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={!!isPending || !!success}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col col-span-1 mt-4 gap-y-4">
                    <div className="text-center">
                        <FormError message={error} />
                        <FormSuccess message={success} />
                    </div>

                    <div className="max-w-sm">
                        <Button
                            type="submit"
                            disabled={!!isPending || !!success}
                            className="my-button-blue"
                        >
                            {isPending ? "Saving..." : "Update Plan Record "}
                            <PenLineIcon className="ml-2 size-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default EditPatientPlan