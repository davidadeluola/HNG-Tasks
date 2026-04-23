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
          className="inline-flex items-center gap-3 typo-heading-s text-(--ui-text)"
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

  const actionButtons = (
    <>
      <Button variant="edit" onClick={() => setIsEditOpen(true)} className="sm:flex-none">
        Edit
      </Button>
      <Button variant="delete" onClick={handleDelete} disabled={isDeleting} className="sm:flex-none">
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      <Button
        variant="markPaid"
        leftIcon={null}
        onClick={handleMarkAsPaid}
        disabled={invoice.status === "paid" || isMarkingPaid}
        className="flex-1 sm:flex-none"
      >
        {invoice.status === "paid"
          ? "Paid"
          : isMarkingPaid
          ? "Updating..."
          : "Mark as Paid"}
      </Button>
    </>
  );

  return (
    <section className="mx-auto w-full grid gap-5 pb-24 md:pb-12 lg:gap-6">
      <Link
        to={ROUTES.accounts}
        className="typo-heading-s inline-flex items-center gap-3 text-(--ui-text)"
      >
        <ChevronLeftIcon size={16} className="text-(--color-primary)" />
        Go back
      </Link>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-(--ui-surface) px-6 py-4 shadow-[0_10px_24px_rgba(72,84,159,0.06)]">
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start">
          <p className="typo-body text-(--ui-muted)">Status</p>
          <p
            className={`typo-heading-s inline-flex min-w-24 items-center justify-center gap-1.5 rounded-md px-3 py-2 ${
              STATUS_PILL_CLASSES[invoice.status]
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {getStatusLabel(invoice.status)}
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {actionButtons}
        </div>
      </div>

      <article className="rounded-xl bg-(--ui-surface) p-6 md:p-8 lg:p-10 shadow-[0_10px_24px_rgba(72,84,159,0.06)]">
        <header className="grid gap-8 sm:grid-cols-2 sm:items-start sm:gap-4">
          <div>
            <h1 className="typo-heading-s text-(--ui-text)">
              <span className="text-(--ui-muted)">#</span>
              {invoice.id}
            </h1>
            <p className="typo-body mt-2 text-(--ui-muted)">{invoice.description}</p>
          </div>
          <address className="typo-body justify-self-start text-(--ui-muted) not-italic sm:justify-self-end sm:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-[1fr_1fr_1fr]">
          <div className="grid gap-8">
            <div>
              <p className="typo-body text-(--ui-muted)">Invoice Date</p>
              <p className="typo-heading-s mt-3 text-(--ui-text)">
                {formatDisplayDate(invoice.createdAt)}
              </p>
            </div>
            <div>
              <p className="typo-body text-(--ui-muted)">Payment Due</p>
              <p className="typo-heading-s mt-3 text-(--ui-text)">
                {formatDisplayDate(invoice.paymentDue)}
              </p>
            </div>
          </div>

          <div>
            <p className="typo-body text-(--ui-muted)">Bill To</p>
            <p className="typo-heading-s mt-3 text-(--ui-text)">{invoice.clientName}</p>
            <address className="typo-body mt-2 text-(--ui-muted) not-italic">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </address>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="typo-body text-(--ui-muted)">Sent to</p>
            <p className="typo-heading-s mt-3 break-all text-(--ui-text)">{invoice.clientEmail}</p>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-lg bg-(--color-surface-soft) dark:bg-(--color-surface-dark-hover)">
          <div className="hidden grid-cols-[1.7fr_0.7fr_0.8fr_0.9fr] px-8 py-6 typo-body text-(--ui-muted) sm:grid">
            <p>Item Name</p>
            <p className="text-center">QTY.</p>
            <p className="text-right">Price</p>
            <p className="text-right">Total</p>
          </div>

          <div className="grid gap-6 p-6 sm:gap-8 sm:px-8 sm:py-6">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between sm:grid sm:grid-cols-[1.7fr_0.7fr_0.8fr_0.9fr]"
              >
                <div className="grid gap-2 sm:contents">
                   <p className="typo-heading-s text-(--ui-text)">{item.name}</p>
                   <p className="typo-heading-s text-(--ui-muted) sm:hidden">
                     {item.quantity} x {formatCurrency(item.price)}
                   </p>
                </div>
                
                <p className="hidden text-center typo-heading-s text-(--ui-muted) sm:block">{item.quantity}</p>
                <p className="hidden text-right typo-heading-s text-(--ui-muted) sm:block">
                  {formatCurrency(item.price)}
                </p>
                <p className="text-right typo-heading-s text-(--ui-text)">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-(--color-surface-dark-hover) dark:bg-(--color-bg-dark-deep) px-6 py-6 sm:px-8 sm:py-7 text-white">
            <p className="typo-body">Amount Due</p>
            <p className="typo-heading-m sm:typo-heading-l">{formatCurrency(invoice.total)}</p> 
          </div>
        </section>
      </article>

      {/* Sticky Bottom Actions Bar for Mobile */}
      <footer className="fixed bottom-0 left-0 z-30 flex w-full items-center gap-2 bg-(--ui-surface) p-6 shadow-[0_-10px_20px_rgba(72,84,159,0.1)] sm:hidden">
        {actionButtons}
      </footer>

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
          <h2 className="typo-heading-m text-(--ui-text)">
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
