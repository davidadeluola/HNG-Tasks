import { AppLayout } from '../layouts/app/AppLayout'
import { DashboardPage as DashboardScreen } from '../components/pages/dashboard'

export default function DashboardPage() {
  return (
    <AppLayout showChrome={false}>
      <DashboardScreen />
    </AppLayout>
  )
}