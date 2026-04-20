import { createContext, useEffect, useMemo, useState } from 'react'
import { invoiceApi } from '../api/invoiceApi'
import type { Invoice, InvoiceInput, InvoiceStatus } from '../types/invoice'

type FilterState = Set<InvoiceStatus>

interface InvoiceContextValue {
  isLoading: boolean
  invoices: Invoice[]
  filteredInvoices: Invoice[]
  activeFilters: FilterState
  setFilters: (nextFilters: FilterState) => void
  getById: (id: string) => Invoice | undefined
  createInvoice: (input: InvoiceInput, status: InvoiceStatus) => Promise<Invoice>
  updateInvoice: (id: string, input: InvoiceInput, status: InvoiceStatus) => Promise<Invoice | undefined>
  deleteInvoice: (id: string) => Promise<void>
  markInvoiceAsPaid: (id: string) => Promise<void>
}

export const InvoiceContext = createContext<InvoiceContextValue | undefined>(undefined)

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<FilterState>(new Set())

  async function refreshInvoices() {
    const all = await invoiceApi.getAll()
    setInvoices(all)
  }

  useEffect(() => {
    let active = true

    async function bootstrap() {
      setIsLoading(true)
      const all = await invoiceApi.getAll()
      if (active) {
        setInvoices(all)
        setIsLoading(false)
      }
    }

    void bootstrap()

    return () => {
      active = false
    }
  }, [])

  const filteredInvoices = useMemo(() => {
    if (activeFilters.size === 0) {
      return invoices
    }

    return invoices.filter((invoice) => activeFilters.has(invoice.status))
  }, [activeFilters, invoices])

  const value = useMemo<InvoiceContextValue>(
    () => ({
      isLoading,
      invoices,
      filteredInvoices,
      activeFilters,
      setFilters: (nextFilters) => setActiveFilters(new Set(nextFilters)),
      getById: (id) => invoices.find((invoice) => invoice.id === id),
      createInvoice: async (input, status) => {
        const created = await invoiceApi.create(input, status)
        await refreshInvoices()
        return created
      },
      updateInvoice: async (id, input, status) => {
        const updated = await invoiceApi.update(id, input, status)
        await refreshInvoices()
        return updated
      },
      deleteInvoice: async (id) => {
        await invoiceApi.remove(id)
        await refreshInvoices()
      },
      markInvoiceAsPaid: async (id) => {
        await invoiceApi.markAsPaid(id)
        await refreshInvoices()
      },
    }),
    [activeFilters, filteredInvoices, invoices, isLoading],
  )

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
}
