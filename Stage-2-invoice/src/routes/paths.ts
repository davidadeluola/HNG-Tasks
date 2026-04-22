export const ROUTES = {
  landing: '/',
  dashboard: '/dashboard',
  accounts: '/dashboard/accounts',
  invoiceDetailsPattern: '/dashboard/accounts/:invoiceId',
  invoiceDetails: (invoiceId: string) => `/dashboard/accounts/${invoiceId}`,
  newInvoice: '/dashboard/invoices/new',
} as const
