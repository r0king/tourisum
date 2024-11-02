// app/admin/dashboard/page.tsx
import { getDashboardStats } from '@/actions/dashboard-actions'
import { getAllApprovedGuides, getPendingGuides } from '@/actions/guide-actions'
import AdminDashboard from '@/components/admin-dashboard'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const revalidate = 60

export default async function AdminDashboardPage() {

  const stats = await getDashboardStats()
  const pending = await getPendingGuides()
  const all = await getAllApprovedGuides()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard stats={stats} initialPendingGuides={pending} initialAllGuides={all} />
    </Suspense>
  )
}