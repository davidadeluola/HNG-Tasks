import { STORAGE_KEYS } from '../utils/constants'
import type { Invoice } from '../types/invoice'
import { indexedDbAdapter } from './indexedDbAdapter'

interface StorageAdapter {
  readInvoices: () => Promise<Invoice[]>
  writeInvoices: (invoices: Invoice[]) => Promise<void>
}

function safeParse(value: string | null): Invoice[] {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as Invoice[]) : []
  } catch {
    return []
  }
}

export const localStorageAdapter = {
  async readInvoices(): Promise<Invoice[]> {
    return safeParse(window.localStorage.getItem(STORAGE_KEYS.invoices))
  },
  async writeInvoices(invoices: Invoice[]): Promise<void> {
    window.localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices))
  },
}

export const hybridStorageAdapter: StorageAdapter = {
  async readInvoices() {
    const [indexed, local] = await Promise.all([
      indexedDbAdapter.readInvoices().catch(() => []),
      localStorageAdapter.readInvoices(),
    ])

    if (indexed.length > 0) {
      await localStorageAdapter.writeInvoices(indexed)
      return indexed
    }

    if (local.length > 0) {
      await indexedDbAdapter.writeInvoices(local).catch(() => undefined)
      return local
    }

    return []
  },

  async writeInvoices(invoices) {
    await Promise.allSettled([
      localStorageAdapter.writeInvoices(invoices),
      indexedDbAdapter.writeInvoices(invoices),
    ])
  },
}
