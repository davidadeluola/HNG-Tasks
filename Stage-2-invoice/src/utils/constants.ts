import type { Invoice, InvoiceStatus } from '../types/invoice'

export const STORAGE_KEYS = {
  invoices: 'invoice-app:invoices',
  theme: 'invoice-app:theme',
} as const

export const STATUS_OPTIONS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
]

export const PAYMENT_TERMS_OPTIONS = [1, 7, 14, 30] as const

export const SEED_INVOICES: Invoice[] = [
  {
    id: 'RT3080',
    createdAt: '2026-04-18',
    paymentDue: '2026-05-18',
    description: 'Website redesign',
    paymentTerms: 30,
    clientName: 'Jensen Huang',
    clientEmail: 'jensen@example.com',
    status: 'pending',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '84 Church Way',
      city: 'Bradford',
      postCode: 'BD1 9PB',
      country: 'United Kingdom',
    },
    items: [{ id: 'it-1', name: 'Design System Audit', quantity: 1, price: 1800, total: 1800 }],
    total: 1800,
  },
  {
    id: 'XM9141',
    createdAt: '2026-04-10',
    paymentDue: '2026-04-17',
    description: 'Mobile app UI',
    paymentTerms: 7,
    clientName: 'Sarah Lee',
    clientEmail: 'sarah@example.com',
    status: 'draft',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '1 Demo Road',
      city: 'Manchester',
      postCode: 'M1 4RT',
      country: 'United Kingdom',
    },
    items: [{ id: 'it-2', name: 'Wireframes', quantity: 3, price: 200, total: 600 }],
    total: 600,
  },
]
