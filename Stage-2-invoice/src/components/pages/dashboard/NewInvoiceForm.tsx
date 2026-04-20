import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { DateInput, SelectInput, TextInput } from "../../ui/Input";
import Form, { FormGrid, FormSection } from "../../ui/Form";
import { useInvoices } from "../../../hooks/useInvoices";
import { ROUTES } from "../../../routes/paths";
import { PAYMENT_TERMS_OPTIONS } from "../../../utils/constants";
import { validateInvoiceInput, type ValidationErrors } from "../../../utils/validators";
import type { InvoiceInput, InvoiceStatus } from "../../../types/invoice";

type ItemState = InvoiceInput["items"][number];

const initialItem: ItemState = {
  id: "item-1",
  name: "",
  quantity: 1,
  price: 0,
  total: 0,
};

const initialInvoice: InvoiceInput = {
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
  items: [initialItem],
};

function getFieldError(errors: ValidationErrors, field: string) {
  return errors[field];
}

export function NewInvoiceForm() {
  const { createInvoice } = useInvoices();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceInput>(initialInvoice);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<InvoiceStatus | null>(null);

  const itemTotal = useMemo(
    () => invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [invoice.items],
  );

  function updateField<K extends keyof InvoiceInput>(field: K, value: InvoiceInput[K]) {
    setInvoice((current) => ({ ...current, [field]: value }));
  }

  function updateAddress(section: "senderAddress" | "clientAddress", field: string, value: string) {
    setInvoice((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function updateItem(index: number, field: keyof ItemState, value: string | number) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
              total:
                field === "quantity" || field === "price"
                  ? Number(field === "quantity" ? value : item.quantity) * Number(field === "price" ? value : item.price)
                  : item.total,
            }
          : item,
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
      items: current.items.length === 1 ? current.items : current.items.filter((_, itemIndex) => itemIndex !== index),
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
    setIsSubmitting(null);
    navigate(ROUTES.dashboard);
  }

  return (
    <Form
      title="New invoice"
      description="Create a soft, focused invoice draft with the same shared design system used everywhere else."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-(--ui-border) bg-(--ui-surface) px-5 py-4">
          <p className="typo-body-variant text-(--ui-muted)">Invoice total updates as you edit the line items.</p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="saveDraft"
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting !== null}
            >
              {isSubmitting === "draft" ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => handleSubmit("pending")}
              disabled={isSubmitting !== null}
            >
              {isSubmitting === "pending" ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      }
    >
      <FormSection title="Invoice details" description="Core information for this invoice.">
        <FormGrid columns={2}>
          <TextInput
            label="Client name"
            value={invoice.clientName}
            onChange={(event) => updateField("clientName", event.target.value)}
            errorText={getFieldError(errors, "clientName")}
          />
          <TextInput
            label="Client email"
            type="email"
            value={invoice.clientEmail}
            onChange={(event) => updateField("clientEmail", event.target.value)}
            errorText={getFieldError(errors, "clientEmail")}
          />
          <DateInput
            label="Issue date"
            value={invoice.createdAt}
            onChange={(event) => updateField("createdAt", event.target.value)}
            errorText={getFieldError(errors, "createdAt")}
          />
          <SelectInput
            label="Payment terms"
            value={String(invoice.paymentTerms)}
            options={PAYMENT_TERMS_OPTIONS.map((term) => ({ label: `${term} day${term > 1 ? "s" : ""}`, value: String(term) }))}
            onChange={(event) => updateField("paymentTerms", Number(event.target.value))}
          />
          <TextInput
            label="Description"
            value={invoice.description}
            onChange={(event) => updateField("description", event.target.value)}
            errorText={getFieldError(errors, "description")}
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Sender address" description="Where the invoice is issued from.">
        <FormGrid columns={2}>
          <TextInput
            label="Street"
            value={invoice.senderAddress.street}
            onChange={(event) => updateAddress("senderAddress", "street", event.target.value)}
          />
          <TextInput
            label="City"
            value={invoice.senderAddress.city}
            onChange={(event) => updateAddress("senderAddress", "city", event.target.value)}
          />
          <TextInput
            label="Post code"
            value={invoice.senderAddress.postCode}
            onChange={(event) => updateAddress("senderAddress", "postCode", event.target.value)}
          />
          <TextInput
            label="Country"
            value={invoice.senderAddress.country}
            onChange={(event) => updateAddress("senderAddress", "country", event.target.value)}
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Client address" description="The billing destination for this invoice.">
        <FormGrid columns={2}>
          <TextInput
            label="Street"
            value={invoice.clientAddress.street}
            onChange={(event) => updateAddress("clientAddress", "street", event.target.value)}
          />
          <TextInput
            label="City"
            value={invoice.clientAddress.city}
            onChange={(event) => updateAddress("clientAddress", "city", event.target.value)}
          />
          <TextInput
            label="Post code"
            value={invoice.clientAddress.postCode}
            onChange={(event) => updateAddress("clientAddress", "postCode", event.target.value)}
          />
          <TextInput
            label="Country"
            value={invoice.clientAddress.country}
            onChange={(event) => updateAddress("clientAddress", "country", event.target.value)}
          />
        </FormGrid>
      </FormSection>

      <FormSection
        title="Items"
        description={getFieldError(errors, "items") ?? "Add one or more line items to calculate the final total."}
      >
        <div className="grid gap-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid gap-4 rounded-3xl border border-(--ui-border) bg-(--ui-surface) p-4 md:grid-cols-[1.5fr_0.6fr_0.8fr_auto] md:items-end">
              <TextInput
                label="Item name"
                value={item.name}
                onChange={(event) => updateItem(index, "name", event.target.value)}
                errorText={getFieldError(errors, `items.${index}.name`)}
              />
              <TextInput
                label="Qty"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) => updateItem(index, "quantity", Number(event.target.value))}
                errorText={getFieldError(errors, `items.${index}.quantity`)}
              />
              <TextInput
                label="Price"
                type="number"
                min={0}
                value={item.price}
                onChange={(event) => updateItem(index, "price", Number(event.target.value))}
                errorText={getFieldError(errors, `items.${index}.price`)}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="h-12 rounded-full border border-(--ui-border) px-4 text-sm font-semibold text-(--ui-muted) transition-colors duration-300 ease-out hover:bg-(--ui-surface-soft)"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-(--ui-border) bg-[rgba(124,93,250,0.05)] px-5 py-4">
          <div>
            <p className="typo-heading-s text-(--ui-text)">Line item total</p>
            <p className="typo-body-variant text-(--ui-muted)">A quick preview of the current invoice value.</p>
          </div>
          <p className="typo-heading-m text-(--ui-text)">{itemTotal.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}</p>
        </div>

        <Button variant="addItem" type="button" onClick={addItem}>
          Add New Item
        </Button>
      </FormSection>
    </Form>
  );
}
