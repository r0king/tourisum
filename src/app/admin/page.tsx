// app/admin/dashboard/page.tsx
import { getDashboardStats } from '@/actions/dashboard-actions'
import { getAllApprovedGuides, getPendingGuides } from '@/actions/guide-actions'
import { getAllDistricts } from '@/actions/district-actions'

import AdminDashboard from '@/components/admin-dashboard'
import { Suspense } from 'react'

export const revalidate = 60

export default async function AdminDashboardPage() {

  const [stats, pending, all, initialDistricts] = await Promise.all([
    getDashboardStats(),
    getPendingGuides(),
    getAllApprovedGuides(),
    getAllDistricts()
  ])
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard stats={stats} initialPendingGuides={pending} initialAllGuides={all} initialDistricts={initialDistricts} />
    </Suspense>
  )
}