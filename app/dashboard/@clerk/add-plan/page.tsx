import PlanInformationPage from "@/components/plan-pages/plan-page"

interface PatientPlanFormProps {
  existingPlanId: string
}

const PatientPlanForm = ({ existingPlanId } : PatientPlanFormProps) => {
  return (
    <PlanInformationPage existingPlanId={existingPlanId}/>
  )
}

export default PatientPlanForm