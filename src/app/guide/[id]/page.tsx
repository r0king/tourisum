import { getGuideById } from "@/actions/guide-actions"
import GuideDashboard from "../guide-dashboard"

const GuidePage = async ({ params }: { params: { id: string } }) => {
  const guideData = await getGuideById(params.id)
  
  return <GuideDashboard initialGuideData={guideData} />
}

export default GuidePage