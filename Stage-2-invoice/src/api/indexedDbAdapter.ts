import { openDB } from 'idb'
import type { Invoice } from '../types/invoice'

const DB_NAME = 'invoice-app-db'
const STORE_NAME = 'invoice-store'
const KEY = 'invoices'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME)
    }
  },
})

export const indexedDbAdapter = {
  async readInvoices(): Promise<Invoice[]> {
    const db = await dbPromise
    const value = await db.get(STORE_NAME, KEY)
    return Array.isArray(value) ? (value as Invoice[]) : []
  },

  async writeInvoices(invoices: Invoice[]): Promise<void> {
    const db = await dbPromise
    await db.put(STORE_NAME, invoices, KEY)
  },
}
