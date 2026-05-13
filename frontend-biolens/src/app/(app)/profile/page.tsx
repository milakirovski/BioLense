import { ProfileLayout } from '@/components/profile/ProfileLayout'
import { AuthGuard } from '@/components/shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <ProfileLayout />
    </AuthGuard>
  )
}