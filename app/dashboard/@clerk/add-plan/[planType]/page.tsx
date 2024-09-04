import FollowUpPlanPage from '@/components/plan-pages/follow-up-plan'
import OPDPlanPage from '@/components/plan-pages/opd-plan'
import React from 'react'

const PlanInputPage = async ({ params } : { params: { planType: string }}) => {

    const planType = params.planType

    if (planType == "follow-up") {
        return (
            <FollowUpPlanPage />
        )
    }

    if (planType == "opd") {
        return (
            <OPDPlanPage/>
        )
    }

    if (planType == "admit") {
        return (
            <div>AdmitPlanPage</div>
        )
    }

    if (planType == "referral") {
        return (
            <div>ReferralPlanPage</div>
        )
    }

    return (
        <div>Invalid Plan Type</div>
    )
}

export default PlanInputPage