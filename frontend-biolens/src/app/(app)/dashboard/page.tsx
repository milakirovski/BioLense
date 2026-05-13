import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { AuthGuard } from '@/components/shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  )
}