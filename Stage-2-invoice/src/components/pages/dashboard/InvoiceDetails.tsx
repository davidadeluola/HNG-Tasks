import { ArrowLeft, ChevronLeftIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../ui/Button";
import { useInvoices } from "../../../hooks/useInvoices";
import { formatCurrency, formatDisplayDate } from "../../../utils/formatters";
import type { InvoiceStatus } from "../../../types/invoice";
import { ROUTES } from "../../../routes/paths";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import Modal from "../../ui/Modal";

const STATUS_PILL_CLASSES: Record<InvoiceStatus, string> = {
  draft:
    "bg-[rgba(55,59,83,0.08)] text-[#373B53] dark:bg-[rgba(223,227,250,0.08)] dark:text-[#DFE3FA]",
  pending: "bg-[rgba(255,143,0,0.12)] text-[#FF8F00]",
  paid: "bg-[rgba(51,214,159,0.12)] text-[#33D69F]",
};

function getStatusLabel(status: InvoiceStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function InvoiceDetails() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { getById, markInvoiceAsPaid, deleteInvoice } = useInvoices();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  const invoice = useMemo(() => {
    if (!invoiceId) {
      return undefined;
    }

    return getById(invoiceId);
  }, [getById, invoiceId]);

  async function handleDelete() {
    if (!invoice) {
      return;
    }

    setIsDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!invoice) {
      return;
    }

    setIsDeleting(true);
    await deleteInvoice(invoice.id);
    setIsDeleteModalOpen(false);
    navigate(ROUTES.accounts);
  }

  async function handleMarkAsPaid() {
    if (!invoice || invoice.status === "paid") {
      return;
    }

    setIsMarkingPaid(true);
    await markInvoiceAsPaid(invoice.id);
    setIsMarkingPaid(false);
  }

  if (!invoice) {
    return (
      <section className="grid gap-6">
        <Link
          to={ROUTES.accounts}
          className="inline-flex items-center gap-3 text-[15px] font-bold tracking-[-0.25px] text-(--ui-text)"
        >
          <ArrowLeft size={16} className="text-(--color-primary)" />
          Go back
        </Link>

        <div className="rounded-2xl border border-(--ui-border) bg-(--ui-surface) p-8 text-(--ui-muted)">
          Invoice not found.
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-220 grid gap-6">
      <Link
        to={ROUTES.accounts}
        className="inline-flex items-center gap-3 text-[15px] font-bold tracking-[-0.25px] text-(--ui-text)"
      >
        <ChevronLeftIcon size={16} className="text-(--color-primary) font-extrabold text-[15px]" />
        Go back
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-(--ui-surface) px-6 py-5 shadow-[0_10px_24px_rgba(72,84,159,0.06)]">
        <div className="flex items-center gap-4">
          <p className="text-[13px] font-medium text-(--ui-muted)">Status</p>
          <p
            className={`inline-flex min-w-24 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[15px] font-bold tracking-[-0.2px] ${
              STATUS_PILL_CLASSES[invoice.status]
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {getStatusLabel(invoice.status)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="edit" onClick={() => setIsEditOpen(true)}>
            Edit
          </Button>
          <Button variant="delete" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="markPaid"
            leftIcon={null}
            onClick={handleMarkAsPaid}
            disabled={invoice.status === "paid" || isMarkingPaid}
          >
            {invoice.status === "paid"
              ? "Paid"
              : isMarkingPaid
              ? "Updating..."
              : "Mark as Paid"}
          </Button>
        </div>
      </div>

      <article className="rounded-xl bg-(--ui-surface) p-8 shadow-[0_10px_24px_rgba(72,84,159,0.06)]">
        <header className="grid gap-4 sm:grid-cols-2 sm:items-start">
          <div>
            <h1 className="typo-heading-s text-(--ui-text)">
              <span className="text-(--ui-muted)">#</span>
              {invoice.id}
            </h1>
            <p className="typo-body mt-2 text-(--ui-muted)">{invoice.description}</p>
          </div>
          <address className="typo-body justify-self-start text-(--ui-muted) not-italic sm:justify-self-end sm:text-right leading-4.5 text-[13px]">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-[1fr_1fr_1fr]">
          <div className="grid gap-6">
            <div>
              <p className="typo-body text-(--ui-muted)">Invoice Date</p>
              <p className="typo-heading-s mt-2 text-(--ui-text)">
                {formatDisplayDate(invoice.createdAt)}
              </p>
            </div>
            <div>
              <p className="typo-body text-(--ui-muted)">Payment Due</p>
              <p className="typo-heading-s mt-2 text-(--ui-text)">
                {formatDisplayDate(invoice.paymentDue)}
              </p>
            </div>
          </div>

          <div>
            <p className="typo-body text-(--ui-muted)">Bill To</p>
            <p className="typo-heading-s mt-2 text-(--ui-text)">{invoice.clientName}</p>
            <address className="typo-body leading-4.5 text-[13px] mt-2 text-(--ui-muted) not-italic">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </address>
          </div>

          <div>
            <p className="typo-body text-(--ui-muted)">Sent to</p>
            <p className="typo-heading-s mt-2 text-(--ui-text)">{invoice.clientEmail}</p>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-lg bg-(--color-surface-soft) dark:bg-(--color-surface-dark-hover)">
          <div className="hidden grid-cols-[1.7fr_0.7fr_0.8fr_0.9fr] px-8 py-6 text-[13px] font-medium text-(--ui-muted) sm:grid">
            <p>Item Name</p>
            <p className="text-center">QTY.</p>
            <p className="text-right">Price</p>
            <p className="text-right">Total</p>
          </div>

          <div className="grid gap-4 px-8 py-6 sm:gap-5">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.7fr_0.7fr_0.8fr_0.9fr] items-center text-[15px] font-bold tracking-[-0.25px]"
              >
                <p className="text-(--ui-text) font-extrabold">{item.name}</p>
                <p className="text-center text-(--ui-muted)">{item.quantity}</p>
                <p className="text-right text-(--color-text-subtle)">
                  {formatCurrency(item.price)}
                </p>
                <p className="text-right text-(--ui-text)">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-(--color-surface-dark-hover) dark:bg-[#141625] px-8 py-7 text-white">
            <p className="text-[13px] font-medium">Amount Due</p>
            <p className="text-[32px] font-bold tracking-[-1px]">{formatCurrency(invoice.total)}</p>
          </div>
        </section>
      </article>

      <CreateInvoiceModal
        key={`${invoice.id}-${isEditOpen ? "open" : "closed"}`}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        invoice={invoice}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
          }
        }}
        placement="center"
        panelClassName="max-w-[30rem] rounded-xl"
      >
        <div className="space-y-6 p-2 md:p-3">
          <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-[1.1] tracking-[-0.7px] text-(--ui-text)">
            Confirm Deletion
          </h2>
          <p className="typo-body text-(--ui-muted)">
            Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="edit"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="delete"
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
