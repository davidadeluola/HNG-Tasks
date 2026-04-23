import { hybridStorageAdapter } from './storageAdapter'
import { SEED_INVOICES } from '../utils/constants'
import { addDays } from '../utils/formatters'
import type { Invoice, InvoiceInput, InvoiceStatus } from '../types/invoice'

function invoiceTotal(items: InvoiceInput['items']): number {
  return items.reduce((acc, item) => acc + item.quantity * item.price, 0)
}

function buildInvoiceId(): string {
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    + String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const numbers = Math.floor(1000 + Math.random() * 9000)
  return `${letters}${numbers}`
}

function isLegacySeedData(invoices: Invoice[]): boolean {
  if (invoices.length !== SEED_INVOICES.length) {
    return false
  }

  return SEED_INVOICES.every((seedInvoice) => {
    const target = invoices.find((invoice) => invoice.id === seedInvoice.id)
    if (!target) {
      return false
    }

    return (
      target.clientName === seedInvoice.clientName
      && target.total === seedInvoice.total
      && target.status === seedInvoice.status
    )
  })
}

async function ensureInvoiceData(): Promise<Invoice[]> {
  const invoices = await hybridStorageAdapter.readInvoices()

  // Migrate legacy demo seed data to an empty first-time dashboard experience.
  if (isLegacySeedData(invoices)) {
    await hybridStorageAdapter.writeInvoices([])
    return []
  }

  return invoices
}

export const invoiceApi = {
  async getAll(): Promise<Invoice[]> {
    return await ensureInvoiceData()
  },

  async getById(id: string): Promise<Invoice | undefined> {
    const invoices = await ensureInvoiceData()
    return invoices.find((invoice) => invoice.id === id)
  },

  async create(input: InvoiceInput, status: InvoiceStatus): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...input,
      id: buildInvoiceId(),
      status,
      paymentDue: addDays(input.createdAt, input.paymentTerms),
      items: input.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      })),
      total: invoiceTotal(input.items),
    }

    const current = await ensureInvoiceData()
    const next = [newInvoice, ...current]
    await hybridStorageAdapter.writeInvoices(next)
    return newInvoice
  },

  async update(id: string, input: InvoiceInput, status: InvoiceStatus): Promise<Invoice | undefined> {
    const current = await ensureInvoiceData()
    const target = current.find((invoice) => invoice.id === id)
    if (!target) {
      return undefined
    }

    const nextStatus: InvoiceStatus = target.status === 'paid' ? 'paid' : status

    const updated: Invoice = {
      ...target,
      ...input,
      status: nextStatus,
      paymentDue: addDays(input.createdAt, input.paymentTerms),
      items: input.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      })),
      total: invoiceTotal(input.items),
    }

    const next = current.map((invoice) => (invoice.id === id ? updated : invoice))
    await hybridStorageAdapter.writeInvoices(next)
    return updated
  },

  async remove(id: string): Promise<boolean> {
    const current = await ensureInvoiceData()
    const next = current.filter((invoice) => invoice.id !== id)
    await hybridStorageAdapter.writeInvoices(next)
    return next.length !== current.length
  },

  async markAsPaid(id: string): Promise<Invoice | undefined> {
    const current = await ensureInvoiceData()
    const target = current.find((invoice) => invoice.id === id)
    if (!target) {
      return undefined
    }

    const updated: Invoice = {
      ...target,
      status: 'paid',
    }

    const next = current.map((invoice) => (invoice.id === id ? updated : invoice))
    await hybridStorageAdapter.writeInvoices(next)
    return updated
  },
}

