import { Trash2 } from "lucide-react";
import Button from "../../ui/Button";
import { DateInput, SelectInput, TextInput } from "../../ui/Input";
import Modal from "../../ui/Modal";
import { useInvoices } from "../../../hooks/useInvoices";
import { useInvoiceForm } from "../../../hooks/useInvoiceForm";
import { PAYMENT_TERMS_OPTIONS } from "../../../utils/constants";
import { validateInvoiceInput } from "../../../utils/validators";
import type { Invoice, InvoiceStatus } from "../../../types";

type CreateInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
};

const MODAL_ERROR_TEXT_CLASS = "mt-1 text-[11px] leading-4 tracking-[-0.05px]";

export function CreateInvoiceModal({
  isOpen,
  onClose,
  invoice,
}: CreateInvoiceModalProps) {
  const { createInvoice, updateInvoice } = useInvoices();
  const {
    formInvoice,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    resetForm,
    updateField,
    updateAddress,
    updateItem,
    addItem,
    removeItem,
    isEditing,
  } = useInvoiceForm(invoice);

  function handleClose() {
    resetForm();
    onClose();
  }

  const clientNameError = errors.clientName;
  const clientEmailError = errors.clientEmail;
  const createdAtError = errors.createdAt;
  const descriptionError = errors.description;
  const itemsError = errors.items;

  async function handleSubmit(status: InvoiceStatus) {
    const nextErrors = validateInvoiceInput(formInvoice);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(status);
    if (invoice) {
      await updateInvoice(invoice.id, formInvoice, status);
    } else {
      await createInvoice(formInvoice, status);
    }
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
      panelClassName="max-w-full rounded-none md:max-w-[80%] md:rounded-r-xl lg:max-w-200"
    >
      <form className="grid gap-10 pb-24">
        <h1 className="typo-heading-m text-(--ui-text)">
          {isEditing ? `Edit #${invoice?.id}` : "New Invoice"}
        </h1>

        <section className="grid gap-6">
          <h2 className="text-xs font-bold tracking-[-0.2px] text-(--color-primary)">
            Bill From
          </h2>
          <TextInput
            label="Street Address"
            value={formInvoice.senderAddress.street}
            onChange={(event) =>
              updateAddress("senderAddress", "street", event.target.value)
            }
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <TextInput
              label="City"
              value={formInvoice.senderAddress.city}
              onChange={(event) =>
                updateAddress("senderAddress", "city", event.target.value)
              }
            />
            <TextInput
              label="Post Code"
              value={formInvoice.senderAddress.postCode}
              onChange={(event) =>
                updateAddress("senderAddress", "postCode", event.target.value)
              }
            />
            <TextInput
              label="Country"
              value={formInvoice.senderAddress.country}
              onChange={(event) =>
                updateAddress("senderAddress", "country", event.target.value)
              }
              containerClassName="col-span-2 sm:col-span-1"
            />
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-xs font-bold tracking-[-0.2px] text-(--color-primary)">
            Bill To
          </h2>
          <TextInput
            label="Client's Name"
            value={formInvoice.clientName}
            onChange={(event) => updateField("clientName", event.target.value)}
            errorText={clientNameError}
            errorTextClassName={MODAL_ERROR_TEXT_CLASS}
          />
          <TextInput
            label="Client's Email"
            type="email"
            value={formInvoice.clientEmail}
            onChange={(event) => updateField("clientEmail", event.target.value)}
            errorText={clientEmailError}
            errorTextClassName={MODAL_ERROR_TEXT_CLASS}
          />
          <TextInput
            label="Street Address"
            value={formInvoice.clientAddress.street}
            onChange={(event) =>
              updateAddress("clientAddress", "street", event.target.value)
            }
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <TextInput
              label="City"
              value={formInvoice.clientAddress.city}
              onChange={(event) =>
                updateAddress("clientAddress", "city", event.target.value)
              }
            />
            <TextInput
              label="Post Code"
              value={formInvoice.clientAddress.postCode}
              onChange={(event) =>
                updateAddress("clientAddress", "postCode", event.target.value)
              }
            />
            <TextInput
              label="Country"
              value={formInvoice.clientAddress.country}
              onChange={(event) =>
                updateAddress("clientAddress", "country", event.target.value)
              }
              containerClassName="col-span-2 sm:col-span-1"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateInput
              label="Invoice Date"
              value={formInvoice.createdAt}
              onChange={(event) => updateField("createdAt", event.target.value)}
              errorText={createdAtError}
            />
            <SelectInput
              label="Payment Terms"
              value={String(formInvoice.paymentTerms)}
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
            value={formInvoice.description}
            onChange={(event) => updateField("description", event.target.value)}
            errorText={descriptionError}
            errorTextClassName={MODAL_ERROR_TEXT_CLASS}
          />
        </section>

        <section className="grid gap-4">
          <h2 className="typo-heading-m text-(--ui-muted)">
            Item List
          </h2>
          {itemsError ? (
            <p className="typo-body-variant text-(--color-danger)">
              {itemsError}
            </p>
          ) : null}

          <div className="hidden grid-cols-[1.6fr_0.5fr_0.8fr_0.8fr_32px] gap-4 px-1 typo-body text-(--ui-muted) sm:grid">
            <p>Item Name</p>
            <p>Qty.</p>
            <p>Price</p>
            <p>Total</p>
            <span aria-hidden="true" />
          </div>

          <div className="grid gap-6">
            {formInvoice.items.map((item, index) => {
              const lineTotal = item.quantity * item.price;

              return (
                <div
                  key={item.id}
                  className="grid gap-3 sm:grid-cols-[1.6fr_0.5fr_0.8fr_0.8fr_32px] sm:items-end sm:gap-4"
                >
                  <TextInput
                    label="Item Name"
                    value={item.name}
                    onChange={(event) =>
                      updateItem(index, "name", event.target.value)
                    }
                    errorText={errors[`items.${index}.name`]}
                    errorTextClassName={MODAL_ERROR_TEXT_CLASS}
                    containerClassName="sm:[&>div]:hidden"
                  />
                  <div className="grid grid-cols-[1fr_1.4fr_1fr_32px] items-end gap-3 sm:contents">
                    <TextInput
                      label="Qty."
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, "quantity", Number(event.target.value))
                      }
                      errorText={errors[`items.${index}.quantity`]}
                      errorTextClassName={MODAL_ERROR_TEXT_CLASS}
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
                      errorText={errors[`items.${index}.price`]}
                      errorTextClassName={MODAL_ERROR_TEXT_CLASS}
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
                </div>
              );
            })}
          </div>

          <Button
            variant="modalGhost"
            type="button"
            onClick={addItem}
            className="mt-2 w-full"
          >
            + Add New Item
          </Button>
        </section>

        <footer className="sticky bottom-0 -mx-5 border-t border-(--ui-border) bg-(--ui-bg) px-5 pb-1 pt-5 md:-mx-7 md:px-7">
          {isEditing ? (
            <div className="flex items-center justify-end gap-2">
              <Button variant="modalGhost" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={null}
                type="button"
                onClick={() => handleSubmit("pending")}
                disabled={isSubmitting !== null}
              >
                {isSubmitting === "pending" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="discard" type="button" onClick={handleClose} className="flex-1 px-2 text-xs sm:px-6 sm:text-[15px]">
                Discard
              </Button>
              <Button
                variant="saveDraft"
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting !== null}
                className="flex-1 px-2 text-xs sm:px-6 sm:text-[15px]"
              >
                {isSubmitting === "draft" ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                variant="primary"
                leftIcon={null}
                type="button"
                onClick={() => handleSubmit("pending")}
                disabled={isSubmitting !== null}
                className="flex-1 px-2 text-xs sm:px-6 sm:text-[15px]"
              >
                {isSubmitting === "pending" ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </footer>
      </form>
    </Modal>
  );
}
