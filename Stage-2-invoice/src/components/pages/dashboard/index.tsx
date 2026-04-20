import { DashboardLayout } from "./DashboardLayout";
import DashboardOverview from "./DashboardOverview";
import { NewInvoiceForm } from "./NewInvoiceForm";

export function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}

export function NewInvoicePage() {
  return (
    <DashboardLayout>
      <NewInvoiceForm />
    </DashboardLayout>
  );
}
