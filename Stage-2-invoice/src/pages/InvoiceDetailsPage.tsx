import { AppLayout } from "../layouts/app/AppLayout";
import { DashboardLayout } from "../components/pages/dashboard/DashboardLayout";
import InvoiceDetails from "../components/pages/dashboard/InvoiceDetails";

export default function InvoiceDetailsPage() {
  return (
    <AppLayout showChrome={false}>
      <DashboardLayout>
        <InvoiceDetails />
      </DashboardLayout>
    </AppLayout>
  );
}
