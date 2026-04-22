import { useState } from "react";
import Button from "../../ui/Button";
import { FilterStateInput } from "../../ui/Input";
import { useInvoices } from "../../../hooks/useInvoices";
import { formatCurrency, formatDisplayDate } from "../../../utils/formatters";
import type { InvoiceStatus } from "../../../types/invoice";
import { CreateInvoiceModal } from "./CreateInvoiceModal";

const STATUS_OPTIONS: { label: string; value: InvoiceStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
];

const STATUS_PILL_CLASSES: Record<InvoiceStatus, string> = {
  draft:
    "bg-[rgba(55,59,83,0.08)] text-[#373B53] dark:bg-[rgba(223,227,250,0.08)] dark:text-[#DFE3FA]",
  pending: "bg-[rgba(255,143,0,0.12)] text-[#FF8F00]",
  paid: "bg-[rgba(51,214,159,0.12)] text-[#33D69F]",
};

function getStatusLabel(status: InvoiceStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function DashboardOverview() {
  const { invoices, filteredInvoices, activeFilters, setFilters, isLoading } =
    useInvoices();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const visibleInvoices =
    activeFilters.size === 0 ? invoices : filteredInvoices;
  const invoiceCountLabel =
    visibleInvoices.length === 1
      ? "1 invoice"
      : `${visibleInvoices.length} invoices`;

  return (
    <section className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[clamp(2.25rem,3vw,3.5rem)] font-bold leading-none tracking-[-1px] text-(--ui-text)">
            Invoices
          </h2>
          <p className="typo-body mt-2 font-medium text-[15px] text-(--ui-muted)">
            {isLoading
              ? "Loading invoices..."
              : `There are ${invoiceCountLabel}`}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <FilterStateInput
            label="Filter by status"
            options={STATUS_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            value={new Set(Array.from(activeFilters))}
            onChange={(nextValue) =>
              setFilters(new Set(Array.from(nextValue) as InvoiceStatus[]))
            }
          />
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            New Invoice
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-120 items-center justify-center rounded-3xl border border-(--ui-border) bg-(--ui-surface) p-8 text-(--ui-muted)">
          Loading dashboard...
        </div>
      ) : invoices.length === 0 ? (
        <div className="m-auto flex min-h-220 items-center justify-center rounded-3xl">
          <div className="flex max-w-65 flex-col items-center text-center">
            <img
              src="/Email-campaign_Flatline%202.svg"
              alt="No invoices illustration"
              className="h-64 w-64"
            />
            <h3 className="mt-12 text-[24px] font-bold leading-[1.1] tracking-[-0.75px] text-(--ui-text)">
              There is nothing here
            </h3>
            <p className="typo-body mt-4 text-(--ui-muted)">
              Create an invoice by clicking the New Invoice button and get
              started
            </p>
          </div>
        </div>
      ) : visibleInvoices.length === 0 ? (
        <div className="flex min-h-120 items-center justify-center rounded-3xl border border-(--ui-border) bg-(--ui-surface) p-8 text-center text-(--ui-muted)">
          No invoices match the selected filters.
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleInvoices.map((invoice) => (
            <article
              key={invoice.id}
              className="grid gap-4 rounded-2xl border border-transparent bg-(--ui-surface) px-6 py-5 shadow-[0_12px_30px_rgba(72,84,159,0.08)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-(--color-primary-hover)/25 hover:shadow-[0_20px_40px_rgba(72,84,159,0.14)] md:grid-cols-[1.1fr_1fr_1fr_auto] lg:grid-cols-[0.8fr_1fr_1fr_1fr_auto]"
            >
              <div className="space-y-1">
                <p className="typo-heading-s text-(--ui-text)">
                  <span className="text-(--ui-muted)">#</span>
                  {invoice.id}
                </p>
                <p className="typo-body text-(--ui-muted)">
                  Due {formatDisplayDate(invoice.paymentDue)}
                </p>
              </div>

              <p className="typo-body text-(--ui-muted)">
                {invoice.clientName}
              </p>

              <p className="typo-heading-s text-(--ui-text)">
                {formatCurrency(invoice.total)}
              </p>

              <p
                className={`inline-flex min-w-26 items-center justify-center gap-2 rounded-md px-3 py-3 text-[15px] font-bold tracking-[-0.25px] ${
                  STATUS_PILL_CLASSES[invoice.status]
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {getStatusLabel(invoice.status)}
              </p>
            </article>
          ))}
        </div>
      )}

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </section>
  );
}
