import { useEffect, useState } from "react";
import type { Invoice, InvoiceInput, InvoiceStatus, ValidationErrors } from "../types";

type ItemState = InvoiceInput["items"][number];

function buildInvoiceInput(source?: Invoice | null): InvoiceInput {
	if (!source) {
		return {
			createdAt: new Date().toISOString().slice(0, 10),
			paymentTerms: 7,
			description: "",
			clientName: "",
			clientEmail: "",
			senderAddress: {
				street: "19 Union Terrace",
				city: "London",
				postCode: "E1 3EZ",
				country: "United Kingdom",
			},
			clientAddress: {
				street: "",
				city: "",
				postCode: "",
				country: "",
			},
			items: [
				{
					id: "item-1",
					name: "",
					quantity: 1,
					price: 0,
					total: 0,
				},
			],
		};
	}

	return {
		createdAt: source.createdAt,
		paymentTerms: source.paymentTerms,
		description: source.description,
		clientName: source.clientName,
		clientEmail: source.clientEmail,
		senderAddress: { ...source.senderAddress },
		clientAddress: { ...source.clientAddress },
		items: source.items.map((item) => ({ ...item })),
	};
}

export function useInvoiceForm(invoice?: Invoice | null) {
	const [formInvoice, setFormInvoice] = useState<InvoiceInput>(() => buildInvoiceInput(invoice));
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState<InvoiceStatus | null>(null);

	useEffect(() => {
		setFormInvoice(buildInvoiceInput(invoice));
		setErrors({});
		setIsSubmitting(null);
	}, [invoice]);

	function resetForm() {
		setFormInvoice(buildInvoiceInput(null));
		setErrors({});
		setIsSubmitting(null);
	}

	function updateField<K extends keyof InvoiceInput>(field: K, value: InvoiceInput[K]) {
		setFormInvoice((current) => ({ ...current, [field]: value }));
	}

	function updateAddress(section: "senderAddress" | "clientAddress", field: string, value: string) {
		setFormInvoice((current) => ({
			...current,
			[section]: {
				...current[section],
				[field]: value,
			},
		}));
	}

	function updateItem(index: number, field: keyof ItemState, value: string | number) {
		setFormInvoice((current) => ({
			...current,
			items: current.items.map((item, itemIndex) =>
				itemIndex === index
					? {
						...item,
						[field]: value,
						total:
							field === "quantity" || field === "price"
								? Number(field === "quantity" ? value : item.quantity) * Number(field === "price" ? value : item.price)
								: item.total,
					}
					: item,
			),
		}));
	}

	function addItem() {
		setFormInvoice((current) => ({
			...current,
			items: [
				...current.items,
				{
					id: `item-${current.items.length + 1}`,
					name: "",
					quantity: 1,
					price: 0,
					total: 0,
				},
			],
		}));
	}

	function removeItem(index: number) {
		setFormInvoice((current) => ({
			...current,
			items:
				current.items.length === 1
					? current.items
					: current.items.filter((_, itemIndex) => itemIndex !== index),
		}));
	}

	return {
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
		isEditing: Boolean(invoice),
	};
}
