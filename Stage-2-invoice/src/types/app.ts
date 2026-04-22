import type { Invoice, InvoiceInput, InvoiceStatus } from "./invoice";

export type ThemeMode = "light" | "dark";

export type FilterState = Set<InvoiceStatus>;

export interface ThemeContextValue {
	theme: ThemeMode;
	toggleTheme: () => void;
}

export interface InvoiceContextValue {
	isLoading: boolean;
	invoices: Invoice[];
	filteredInvoices: Invoice[];
	activeFilters: FilterState;
	setFilters: (nextFilters: FilterState) => void;
	getById: (id: string) => Invoice | undefined;
	createInvoice: (input: InvoiceInput, status: InvoiceStatus) => Promise<Invoice>;
	updateInvoice: (id: string, input: InvoiceInput, status: InvoiceStatus) => Promise<Invoice | undefined>;
	deleteInvoice: (id: string) => Promise<void>;
	markInvoiceAsPaid: (id: string) => Promise<void>;
}
