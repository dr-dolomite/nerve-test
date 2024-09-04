"use client";

import * as z from "zod";
import {
    useTransition,
    useState
} from "react";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const ReferralPlanPage = () => {
  return (
    <div>ReferralPlanPage</div>
  )
}

export default ReferralPlanPage