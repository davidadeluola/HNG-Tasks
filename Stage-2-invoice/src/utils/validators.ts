import type { InvoiceInput } from '../types/invoice'

export interface ValidationErrors {
  [field: string]: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateInvoiceInput(input: InvoiceInput): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!input.clientName.trim()) {
    errors.clientName = 'Client name is required.'
  }

  if (!input.clientEmail.trim()) {
    errors.clientEmail = 'Client email is required.'
  } else if (!EMAIL_PATTERN.test(input.clientEmail)) {
    errors.clientEmail = 'Provide a valid email address.'
  }

  if (!input.description.trim()) {
    errors.description = 'Project description is required.'
  }

  if (!input.createdAt) {
    errors.createdAt = 'Issue date is required.'
  }

  if (input.items.length === 0) {
    errors.items = 'At least one item is required.'
  }

  input.items.forEach((item, index) => {
    if (!item.name.trim()) {
      errors[`items.${index}.name`] = 'Item name is required.'
    }
    if (item.quantity <= 0) {
      errors[`items.${index}.quantity`] = 'Quantity must be greater than zero.'
    }
    if (item.price <= 0) {
      errors[`items.${index}.price`] = 'Price must be greater than zero.'
    }
  })

  return errors
}
