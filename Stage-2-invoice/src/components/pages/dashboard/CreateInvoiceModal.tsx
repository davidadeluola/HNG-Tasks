import { useState } from "react";
import { Trash2 } from "lucide-react";
import Button from "../../ui/Button";
import { DateInput, SelectInput, TextInput } from "../../ui/Input";
import Modal from "../../ui/Modal";
import { useInvoices } from "../../../hooks/useInvoices";
import { PAYMENT_TERMS_OPTIONS } from "../../../utils/constants";
import {
  validateInvoiceInput,
  type ValidationErrors,
} from "../../../utils/validators";
import type { InvoiceInput, InvoiceStatus } from "../../../types/invoice";

type CreateInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ItemState = InvoiceInput["items"][number];

function buildInitialInvoice(): InvoiceInput {
  return {
    createdAt: new Date().toISOString().slice(0, 10),
    paymentTerms: 7,
    description: "",
    clientName: "",
    clientEmail: "",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [
      {
        id: "item-1",
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ],
  };
}

function getFieldError(errors: ValidationErrors, field: string) {
  return errors[field];
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
}: CreateInvoiceModalProps) {
  const { createInvoice } = useInvoices();
  const [invoice, setInvoice] = useState<InvoiceInput>(buildInitialInvoice);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<InvoiceStatus | null>(null);

  function resetForm() {
    setInvoice(buildInitialInvoice());
    setErrors({});
    setIsSubmitting(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function updateField<K extends keyof InvoiceInput>(
    field: K,
    value: InvoiceInput[K]
  ) {
    setInvoice((current) => ({ ...current, [field]: value }));
  }

  function updateAddress(
    section: "senderAddress" | "clientAddress",
    field: string,
    value: string
  ) {
    setInvoice((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function updateItem(
    index: number,
    field: keyof ItemState,
    value: string | number
  ) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
              total:
                field === "quantity" || field === "price"
                  ? Number(field === "quantity" ? value : item.quantity) *
                    Number(field === "price" ? value : item.price)
                  : item.total,
            }
          : item
      ),
    }));
  }

  function addItem() {
    setInvoice((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: `item-${current.items.length + 1}`,
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
    }));
  }

  function removeItem(index: number) {
    setInvoice((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(status: InvoiceStatus) {
    const nextErrors = validateInvoiceInput(invoice);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(status);
    await createInvoice(invoice, status);
    handleClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={undefined}
      description={undefined}
      placement="left"
      className="lg:left-24"
      panelClassName="max-w-200 rounded-none"
    >
      <form className="grid gap-10 pb-24">
        <h1 className="typo-heading-m text-(--ui-text)">New Invoice</h1>

        <section className="grid gap-6">
          <h2 className="text-xs font-bold tracking-[-0.2px] text-(--color-primary)">
            Bill From
          </h2>
          <TextInput
            label="Street Address"
            value={invoice.senderAddress.street}
            onChange={(event) =>
              updateAddress("senderAddress", "street", event.target.value)
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextInput
              label="City"
              value={invoice.senderAddress.city}
              onChange={(event) =>
                updateAddress("senderAddress", "city", event.target.value)
              }
            />
            <TextInput
              label="Post Code"
              value={invoice.senderAddress.postCode}
              onChange={(event) =>
                updateAddress("senderAddress", "postCode", event.target.value)
              }
            />
            <TextInput
              label="Country"
              value={invoice.senderAddress.country}
              onChange={(event) =>
                updateAddress("senderAddress", "country", event.target.value)
              }
            />
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-xs font-bold tracking-[-0.2px] text-(--color-primary)">
            Bill To
          </h2>
          <TextInput
            label="Client's Name"
            value={invoice.clientName}
            onChange={(event) => updateField("clientName", event.target.value)}
            errorText={getFieldError(errors, "clientName")}
          />
          <TextInput
            label="Client's Email"
            type="email"
            value={invoice.clientEmail}
            onChange={(event) => updateField("clientEmail", event.target.value)}
            errorText={getFieldError(errors, "clientEmail")}
          />
          <TextInput
            label="Street Address"
            value={invoice.clientAddress.street}
            onChange={(event) =>
              updateAddress("clientAddress", "street", event.target.value)
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextInput
              label="City"
              value={invoice.clientAddress.city}
              onChange={(event) =>
                updateAddress("clientAddress", "city", event.target.value)
              }
            />
            <TextInput
              label="Post Code"
              value={invoice.clientAddress.postCode}
              onChange={(event) =>
                updateAddress("clientAddress", "postCode", event.target.value)
              }
            />
            <TextInput
              label="Country"
              value={invoice.clientAddress.country}
              onChange={(event) =>
                updateAddress("clientAddress", "country", event.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateInput
              label="Invoice Date"
              value={invoice.createdAt}
              onChange={(event) => updateField("createdAt", event.target.value)}
              errorText={getFieldError(errors, "createdAt")}
            />
            <SelectInput
              label="Payment Terms"
              value={String(invoice.paymentTerms)}
              options={PAYMENT_TERMS_OPTIONS.map((term) => ({
                label: `Net ${term} Day${term > 1 ? "s" : ""}`,
                value: String(term),
              }))}
              onChange={(event) =>
                updateField("paymentTerms", Number(event.target.value))
              }
            />
          </div>

          <TextInput
            label="Project Description"
            value={invoice.description}
            onChange={(event) => updateField("description", event.target.value)}
            errorText={getFieldError(errors, "description")}
          />
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-bold tracking-[-0.4px] text-(--ui-muted)">
            Item List
          </h2>
          {getFieldError(errors, "items") ? (
            <p className="typo-body-variant text-(--color-danger)">
              {getFieldError(errors, "items")}
            </p>
          ) : null}

          <div className="hidden grid-cols-[1.6fr_0.5fr_0.8fr_0.8fr_32px] gap-4 px-1 text-xs font-medium text-(--ui-muted) sm:grid">
            <p>Item Name</p>
            <p>Qty.</p>
            <p>Price</p>
            <p>Total</p>
            <span aria-hidden="true" />
          </div>

          <div className="grid gap-4">
            {invoice.items.map((item, index) => {
              const lineTotal = item.quantity * item.price;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_0.5fr_0.8fr_0.8fr_32px] sm:items-end sm:gap-4"
                >
                  <TextInput
                    label="Item Name"
                    value={item.name}
                    onChange={(event) =>
                      updateItem(index, "name", event.target.value)
                    }
                    errorText={getFieldError(errors, `items.${index}.name`)}
                    containerClassName="sm:[&>div]:hidden"
                  />
                  <TextInput
                    label="Qty."
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(index, "quantity", Number(event.target.value))
                    }
                    errorText={getFieldError(errors, `items.${index}.quantity`)}
                    containerClassName="sm:[&>div]:hidden"
                  />
                  <TextInput
                    label="Price"
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(event) =>
                      updateItem(index, "price", Number(event.target.value))
                    }
                    errorText={getFieldError(errors, `items.${index}.price`)}
                    containerClassName="sm:[&>div]:hidden"
                  />

                  <div>
                    <div className="mb-2 sm:hidden">
                      <span className="form-label">Total</span>
                    </div>
                    <p className="flex h-12 items-center text-[15px] font-bold text-(--ui-muted)">
                      {lineTotal.toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex h-12 w-8 items-center justify-center self-end text-(--ui-muted) transition-colors duration-200 ease-out hover:text-(--color-danger)"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <Button
            variant="ghost"
            type="button"
            onClick={addItem}
            className="mt-2 w-full"
          >
            + Add New Item
          </Button>
        </section>

        <footer className="sticky bottom-0 -mx-5 border-t border-(--ui-border) bg-(--ui-bg) px-5 pb-1 pt-5 md:-mx-7 md:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" type="button" onClick={handleClose}>
              Discard
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="saveDraft"
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting !== null}
              >
                {isSubmitting === "draft" ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                variant="primary"
                leftIcon={null}
                type="button"
                onClick={() => handleSubmit("pending")}
                disabled={isSubmitting !== null}
              >
                {isSubmitting === "pending" ? "Saving..." : "Save & Send"}
              </Button>
            </div>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
