import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { FilterStateInput } from "../../ui/Input";
import { useInvoices } from "../../../hooks/useInvoices";
import { formatCurrency, formatDisplayDate } from "../../../utils/formatters";
import type { InvoiceStatus } from "../../../types/invoice";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { ROUTES } from "../../../routes/paths";

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
  const navigate = useNavigate();
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
    <section className="grid gap-8 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="typo-heading-l sm:typo-heading-l text-(--ui-text)">
            Invoices
          </h1>
          <p className="typo-body mt-1 text-(--ui-muted) sm:mt-2">
            {isLoading ? (
              "Loading..."
            ) : visibleInvoices.length === 0 ? (
              "No invoices"
            ) : (
              <>
                <span className="sm:hidden">{invoiceCountLabel}</span>
                <span className="hidden sm:inline">
                  There are {invoiceCountLabel} in total
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <FilterStateInput
            label={
              <>
                <span className="sm:hidden">Filter</span>
                <span className="hidden sm:inline">Filter by status</span>
              </>
            }
            options={STATUS_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            value={new Set(Array.from(activeFilters))}
            onChange={(nextValue) =>
              setFilters(new Set(Array.from(nextValue) as InvoiceStatus[]))
            }
            buttonClassName="text-xs sm:text-[15px]"
          />
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} className="h-11 min-w-0 gap-1.5 pl-1.5 pr-3 sm:h-12 sm:min-w-[160px] sm:gap-2 sm:pl-1.5 sm:pr-6">
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
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
              src="/Email-campaign_Flatline-2.svg"
              alt="No invoices illustration"
              className="h-64 w-64"
            />
            <h3 className="mt-12 typo-heading-m text-(--ui-text)">
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
              onClick={() => navigate(ROUTES.invoiceDetails(invoice.id))}
              className="grid cursor-pointer gap-6 rounded-lg bg-(--ui-surface) p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 md:grid-cols-[0.85fr_1fr_1fr_1fr_1.1fr_auto] md:items-center md:gap-4 md:px-8 md:py-4 lg:gap-5"
            >
              {/* Mobile: Top Row / Desktop: ID & Client Name columns */}
              <div className="flex items-center justify-between md:contents">
                <p className="typo-heading-s text-(--ui-text)">
                  <span className="text-(--ui-muted)">#</span>
                  {invoice.id}
                </p>
                <p className="typo-body text-(--ui-muted) md:hidden">
                  {invoice.clientName}
                </p>
              </div>

              {/* Desktop Only: Client Name (between ID and Date) */}
              <p className="hidden typo-body text-(--ui-muted) md:block">
                Due {formatDisplayDate(invoice.paymentDue)}
              </p>

              <p className="hidden typo-body text-(--ui-muted) md:block">
                {invoice.clientName}
              </p>

              {/* Mobile: Bottom Row / Desktop: Total & Status columns */}
              <div className="flex items-center justify-between md:contents">
                <div className="flex flex-col gap-2 md:contents">
                  <p className="typo-body text-(--ui-muted) md:hidden">
                    Due {formatDisplayDate(invoice.paymentDue)}
                  </p>
                  <p className="typo-heading-s text-(--ui-text)">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>

                <div className="flex items-center gap-5 md:contents">
                  <p
                    className={`typo-heading-s inline-flex min-w-28 items-center justify-center gap-1.5 rounded-md px-2 py-2.5 ${
                      STATUS_PILL_CLASSES[invoice.status]
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {getStatusLabel(invoice.status)}
                  </p>

                  <div className="hidden md:block">
                    <ChevronRight
                      size={16}
                      strokeWidth={2.6}
                      className="text-(--color-primary)"
                    />
                  </div>
                </div>
              </div>
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
