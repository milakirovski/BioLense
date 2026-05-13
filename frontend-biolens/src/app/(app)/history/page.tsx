import { HistoryLayout } from '@/components/history/HistoryLayout'
import { AuthGuard } from '@/components/shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <HistoryLayout />
    </AuthGuard>
  )
}