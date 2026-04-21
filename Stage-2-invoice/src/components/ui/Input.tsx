import { useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

type FieldVisualState = "default" | "filled" | "active" | "disabled" | "error";

type FieldLabelProps = {
	label: string;
	htmlFor: string;
	helperText?: string;
	className?: string;
};

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
	label: string;
	visualState?: FieldVisualState;
	helperText?: string;
	errorText?: string;
	containerClassName?: string;
};

type SelectOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

type SelectInputProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
	label: string;
	visualState?: FieldVisualState;
	helperText?: string;
	errorText?: string;
	options: SelectOption[];
	containerClassName?: string;
};

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
	label: string;
	visualState?: FieldVisualState;
	helperText?: string;
	errorText?: string;
	containerClassName?: string;
};

type FilterStateOption = {
	label: string;
	value: string;
};

type FilterStateInputProps = {
	label?: string;
	options: FilterStateOption[];
	value: Set<string>;
	onChange: (nextValue: Set<string>) => void;
	className?: string;
	buttonClassName?: string;
	menuClassName?: string;
};

function FieldLabel({ label, htmlFor, helperText, className }: FieldLabelProps) {
	return (
		<div className={twMerge("mb-2 flex items-center justify-between", className)}>
			<label htmlFor={htmlFor} className="form-label">
				{label}
			</label>
			{helperText ? <span className="form-helper">{helperText}</span> : null}
		</div>
	);
}

function fieldStateClass(visualState: FieldVisualState, hasError: boolean) {
	if (hasError || visualState === "error") {
		return "border-(--color-danger) text-(--color-surface-dark) focus:border-(--color-danger) focus:ring-(--color-danger)/30 dark:focus:ring-0 dark:focus-visible:ring-0 dark:focus-visible:outline-none";
	}

	if (visualState === "active") {
		return "border-(--color-primary-hover) text-(--color-surface-dark) focus:border-(--color-primary) focus:ring-(--color-primary)/30 dark:focus:ring-0 dark:focus-visible:ring-0 dark:focus-visible:outline-none";
	}

	if (visualState === "disabled") {
		return "border-(--color-border-soft) bg-(--color-surface-soft) text-(--color-text-subtle) opacity-80";
	}

	if (visualState === "filled") {
		return "border-(--color-border-soft) text-(--color-surface-dark)";
	}

	return "border-(--color-border-soft) text-(--color-surface-dark) focus:border-(--color-primary-hover) focus:ring-(--color-primary-hover)/25 dark:focus:ring-0 dark:focus-visible:ring-0 dark:focus-visible:outline-none";
}

function fieldIconClass(visualState: FieldVisualState, hasError: boolean) {
	if (hasError || visualState === "error") {
		return "text-(--color-danger)";
	}

	if (visualState === "active") {
		return "text-(--color-primary)";
	}

	if (visualState === "disabled") {
		return "text-(--color-text-muted)";
	}

	return "text-(--color-text-subtle)";
}

export function TextInput({
	id,
	label,
	visualState = "default",
	helperText,
	errorText,
	className,
	containerClassName,
	disabled,
	...props
}: TextInputProps) {
	const inputId = id ?? `text-input-${label.toLowerCase().replace(/\s+/g, "-")}`;
	const isDisabled = disabled || visualState === "disabled";
	const hasError = Boolean(errorText);

	return (
		<div className={containerClassName}>
			<FieldLabel label={label} htmlFor={inputId} helperText={helperText} />
			<input
				id={inputId}
				disabled={isDisabled}
				className={twMerge(
					"typo-body h-12 w-full rounded-sm border bg-(--ui-surface) px-4 font-semibold outline-none focus-visible:outline-none transition-colors duration-300 ease-out",
					fieldStateClass(visualState, hasError),
					className,
				)}
				{...props}
			/>
			{errorText ? <p className="mt-1 typo-body-variant text-[#EC5757]">{errorText}</p> : null}
		</div>
	);
}

export function SelectInput({
	id,
	label,
	options,
	visualState = "default",
	helperText,
	errorText,
	className,
	containerClassName,
	disabled,
	...props
}: SelectInputProps) {
	const inputId = id ?? `select-input-${label.toLowerCase().replace(/\s+/g, "-")}`;
	const isDisabled = disabled || visualState === "disabled";
	const hasError = Boolean(errorText);
	const isControlled = props.value !== undefined;
	const [selectedValue, setSelectedValue] = useState(String(props.defaultValue ?? options[0]?.value ?? ""));
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const selectedValueToShow = isControlled ? String(props.value) : selectedValue;
	const selectedOption = options.find((option) => option.value === selectedValueToShow) ?? options[0];

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (!menuRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	function selectOption(value: string) {
		if (!isControlled) {
			setSelectedValue(value);
		}
		setIsOpen(false);
		props.onChange?.({
			currentTarget: { value } as HTMLSelectElement,
			target: { value } as EventTarget & HTMLSelectElement,
		} as React.ChangeEvent<HTMLSelectElement>);
	}

	return (
		<div className={containerClassName}>
			<FieldLabel label={label} htmlFor={inputId} helperText={helperText} />
			<div ref={menuRef} className="relative">
				<button
					type="button"
					id={inputId}
					disabled={isDisabled}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					onClick={() => setIsOpen((value) => !value)}
					className={twMerge(
						"typo-body flex h-12 w-full items-center justify-between rounded-sm border bg-(--ui-surface) px-4 text-left outline-none focus-visible:outline-none transition-colors duration-300 ease-out",
						fieldStateClass(visualState, hasError),
						className,
					)}
				>
					<span className="font-semibold text-(--color-surface-dark)">{selectedOption?.label ?? ""}</span>
					<ChevronDown size={16} strokeWidth={2.25} className={fieldIconClass(visualState, hasError)} />
				</button>

				{isOpen && !isDisabled ? (
					<div className="absolute left-0 top-[calc(100%+16px)] z-20 w-full overflow-hidden rounded-[10px] border border-(--color-border-soft) bg-(--ui-surface) shadow-[0_10px_30px_rgba(72,84,159,0.25)]">
						<ul role="listbox" className="divide-y divide-(--color-border-soft)">
							{options.map((option) => {
								const isSelected = option.value === selectedValue;

								return (
									<li key={option.value} role="option" aria-selected={isSelected}>
										<button
											type="button"
											onClick={() => selectOption(option.value)}
											className={twMerge(
													"typo-body w-full px-5 py-4 text-left font-bold transition-colors duration-200 ease-out",
												isSelected
													? "bg-(--color-primary) text-white"
													: "text-(--color-surface-dark) hover:bg-(--color-primary-hover)/10 hover:text-(--color-primary)",
											)}
										>
											{option.label}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				) : null}
			</div>
			{errorText ? <p className="mt-1 typo-body-variant text-(--color-danger)">{errorText}</p> : null}
		</div>
	);
}

export function DateInput({
	id,
	label,
	visualState = "default",
	helperText,
	errorText,
	className,
	containerClassName,
	disabled,
	...props
}: DateInputProps) {
	const inputId = id ?? `date-input-${label.toLowerCase().replace(/\s+/g, "-")}`;
	const isDisabled = disabled || visualState === "disabled";
	const hasError = Boolean(errorText);
	const inputRef = useRef<HTMLInputElement>(null);

	const todayIso = new Date().toISOString().slice(0, 10);
	const hasControlledValue = Object.prototype.hasOwnProperty.call(props, "value");
	const hasDefaultValue = Object.prototype.hasOwnProperty.call(props, "defaultValue");

	function openDatePicker() {
		if (!inputRef.current || isDisabled) {
			return;
		}

		const pickerTarget = inputRef.current as HTMLInputElement & { showPicker?: () => void };

		if (typeof pickerTarget.showPicker === "function") {
			pickerTarget.showPicker();
			return;
		}

		inputRef.current.focus();
		inputRef.current.click();
	}

	return (
		<div className={containerClassName}>
			<FieldLabel label={label} htmlFor={inputId} helperText={helperText} />
			<div className="relative">
				<input
					ref={inputRef}
					id={inputId}
					type="date"
					disabled={isDisabled}
					className={twMerge(
						"typo-body h-12 w-full rounded-sm border bg-(--ui-surface) px-4 pr-10 outline-none focus-visible:outline-none transition-colors duration-300 ease-out scheme-light dark:scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-0",
						fieldStateClass(visualState, hasError),
						className,
					)}
					{...(!hasControlledValue && !hasDefaultValue ? { defaultValue: todayIso } : {})}
					{...props}
				/>
				<button
					type="button"
					onClick={openDatePicker}
					disabled={isDisabled}
					aria-label={`Open ${label} calendar`}
					className={twMerge(
						"absolute right-3 top-1/2 -translate-y-1/2",
						fieldIconClass(visualState, hasError),
					)}
				>
					<CalendarDays size={16} strokeWidth={2.25} />
				</button>
			</div>
			{errorText ? <p className="mt-1 typo-body-variant text-(--color-danger)">{errorText}</p> : null}
		</div>
	);
}

export function FilterStateInput({
	label = "Filter by status",
	options,
	value,
	onChange,
	className,
	buttonClassName,
	menuClassName,
}: FilterStateInputProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	const allSelected = options.length > 0 && value.size === options.length;
	const someSelected = value.size > 0 && value.size < options.length;

	function toggleOption(optionValue: string) {
		const nextValue = new Set(value);
		if (nextValue.has(optionValue)) {
			nextValue.delete(optionValue);
		} else {
			nextValue.add(optionValue);
		}

		onChange(nextValue);
	}

	function toggleAll() {
		if (allSelected) {
			onChange(new Set());
			return;
		}

		onChange(new Set(options.map((option) => option.value)));
	}

	return (
		<div ref={containerRef} className={twMerge("relative", className)}>
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				onClick={() => setIsOpen((previous) => !previous)}
				className={twMerge(
					"inline-flex items-center gap-3 text-[15px] font-bold tracking-[-0.25px] text-(--ui-text) outline-none transition-colors duration-200 ease-out hover:text-(--color-primary) focus-visible:text-(--color-primary)",
					buttonClassName,
				)}
			>
				<span>{label}</span>
				<ChevronDown
					size={16}
					strokeWidth={2.5}
					className={twMerge(
						"text-(--color-primary) transition-transform duration-200 ease-out",
						isOpen ? "rotate-180" : "rotate-0",
					)}
				/>
			</button>

			{isOpen ? (
				<div
					role="menu"
					className={twMerge(
						"absolute right-0 top-[calc(100%+14px)] z-30 w-48 rounded-lg border border-(--ui-border) bg-(--ui-surface) p-5",
						menuClassName,
					)}
				>
					<ul className="grid gap-3">
						<li>
							<label className="inline-flex cursor-pointer items-center gap-3 text-[15px] font-bold tracking-[-0.25px] text-(--ui-text)">
								<input
									type="checkbox"
									checked={allSelected}
									ref={(input) => {
										if (input) {
											input.indeterminate = someSelected;
										}
									}}
									onChange={toggleAll}
									className="h-4 w-4 rounded-sm border-(--ui-border) accent-[#7C5DFA]"
								/>
								<span>All</span>
							</label>
						</li>
						<li className="h-px bg-(--ui-border)" aria-hidden="true" />
						{options.map((option) => {
							const isChecked = value.has(option.value);

							return (
								<li key={option.value}>
									<label className="inline-flex cursor-pointer items-center gap-3 text-[15px] font-bold tracking-[-0.25px] text-(--ui-text)">
										<input
											type="checkbox"
											checked={isChecked}
											onChange={() => toggleOption(option.value)}
											className="h-4 w-4 rounded-sm border-(--ui-border) accent-[#7C5DFA]"
										/>
										<span>{option.label}</span>
									</label>
								</li>
							);
						})}
					</ul>
				</div>
			) : null}
		</div>
	);
}

export function FieldSurface({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="rounded-xl border border-(--color-border-soft) bg-(--ui-surface) p-5 shadow-[0_10px_20px_rgba(72,84,159,0.12)]">
			<h3 className="typo-heading-s mb-4 text-(--color-text-subtle)">{title}</h3>
			<div className="grid gap-4">{children}</div>
		</section>
	);
}
