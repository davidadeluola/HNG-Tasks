import { AppLayout } from '../layouts/app/AppLayout'
import { NewInvoicePage as NewInvoiceScreen } from '../components/pages/dashboard'

export default function NewInvoicePage() {
  return (
    <AppLayout showChrome={false}>
      <NewInvoiceScreen />
    </AppLayout>
  )
}