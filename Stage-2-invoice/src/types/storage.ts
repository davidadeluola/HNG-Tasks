import type { Invoice } from "./invoice";

export interface StorageAdapter {
	readInvoices: () => Promise<Invoice[]>;
	writeInvoices: (invoices: Invoice[]) => Promise<void>;
}
