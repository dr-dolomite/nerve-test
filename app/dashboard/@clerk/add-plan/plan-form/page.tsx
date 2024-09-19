"use client";
import { useSearchParams } from "next/navigation";

import OPDPlanPage from "@/components/plan-pages/opd-plan";

const PlanFormPage = () => {

    const searchParams = useSearchParams();
    const planType = searchParams.get("type") ?? "none";
    const patientId = searchParams.get("patientId") ?? "";
    const patientPlanId = searchParams.get("planId") ?? "";
    const recordId = searchParams.get("recordId") ?? "";

    if (planType === "opd") {
        return <OPDPlanPage patientPlanId={patientPlanId} patientId={patientId} recordId={recordId} />;
    }
};

export default PlanFormPage;
