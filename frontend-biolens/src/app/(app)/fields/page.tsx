import { FieldsLayout } from '@/components/fields/FieldsLayout'
import { AuthGuard } from '@/components/shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <FieldsLayout />
    </AuthGuard>
  )
}