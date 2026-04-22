import { useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";

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
	errorTextClassName?: string;
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
		return "border-(--color-danger) text-[#0C0E16] focus:border-(--color-danger) dark:text-white dark:focus:ring-(--color-danger)/35";
	}

	if (visualState === "active") {
		return "border-[#7C5DFA] text-[#0C0E16] focus:border-[#7C5DFA] dark:border-(--color-primary-hover) dark:text-white dark:focus:border-(--color-primary) dark:focus:ring-(--color-primary)/35";
	}

	if (visualState === "disabled") {
		return "border-[#DFE3FA] bg-(--color-surface-soft) text-[#0C0E16] opacity-80 dark:border-(--color-surface-dark-hover) dark:bg-(--color-surface-dark-hover) dark:text-white dark:opacity-70";
	}

	if (visualState === "filled") {
		return "border-[#DFE3FA] text-[#0C0E16] dark:border-(--color-surface-dark-hover) dark:text-white";
	}

	return "border-[#DFE3FA] text-[#0C0E16] focus:border-[#7C5DFA] dark:border-(--color-surface-dark-hover) dark:text-white dark:focus:border-(--color-primary) dark:focus:ring-(--color-primary)/35";
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
	errorTextClassName,
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
					"form-control typo-body h-12 w-full rounded-sm border border-[#DFE3FA] bg-(--ui-surface) px-4 font-bold text-dark outline-none focus-visible:outline-none transition-colors duration-300 ease-out dark:text-white",
					fieldStateClass(visualState, hasError),
					className,
				)}
				{...props}
			/>
			{errorText ? (
				<p className={twMerge("mt-1 typo-body-variant text-[#EC5757]", errorTextClassName)}>
					{errorText}
				</p>
			) : null}
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
						"form-control typo-body flex h-12 w-full items-center justify-between rounded-sm border border-[#DFE3FA] bg-(--ui-surface) px-4 text-left outline-none focus-visible:outline-none transition-colors duration-300 ease-out",
						fieldStateClass(visualState, hasError),
						className,
					)}
				>
					<span className="font-semibold text-(--ui-text)">{selectedOption?.label ?? ""}</span>
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
													: "text-(--ui-text) hover:bg-(--color-primary-hover)/10 hover:text-(--color-primary)",
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

	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const isControlled = props.value !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = useState<string>(
		(props.defaultValue as string) ?? new Date().toISOString().slice(0, 10)
	);

	const dateValue = isControlled ? (props.value as string) : uncontrolledValue;
	const selectedDate = dateValue ? dayjs(dateValue).toDate() : undefined;

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	function handleSelect(date: Date | undefined) {
		if (date) {
			const formattedDate = dayjs(date).format("YYYY-MM-DD");
			if (!isControlled) {
				setUncontrolledValue(formattedDate);
			}
			setIsOpen(false);
			props.onChange?.({
				target: { value: formattedDate, name: props.name },
				currentTarget: { value: formattedDate, name: props.name }
			} as unknown as React.ChangeEvent<HTMLInputElement>);
		} else {
			if (!isControlled) {
				setUncontrolledValue("");
			}
			props.onChange?.({
				target: { value: "", name: props.name },
				currentTarget: { value: "", name: props.name }
			} as unknown as React.ChangeEvent<HTMLInputElement>);
		}
	}

	return (
		<div className={containerClassName} ref={containerRef}>
			<FieldLabel label={label} htmlFor={inputId} helperText={helperText} />
			<div className="relative">
				<button
					type="button"
					id={inputId}
					disabled={isDisabled}
					onClick={() => setIsOpen(!isOpen)}
					className={twMerge(
						"form-control typo-body h-12 w-full rounded-sm border border-[#DFE3FA] bg-(--ui-surface) px-4 flex items-center justify-between outline-none focus-visible:outline-none transition-colors duration-300 ease-out",
						fieldStateClass(visualState, hasError),
						className,
					)}
				>
					<span className={twMerge("font-bold", dateValue ? "text-dark dark:text-white" : "text-dark/50 dark:text-white/50")}>
						{dateValue ? dayjs(dateValue).format("DD MMM YYYY") : "Select Date"}
					</span>
					<CalendarDays size={16} strokeWidth={2.25} className={fieldIconClass(visualState, hasError)} />
				</button>
				
				{isOpen && !isDisabled ? (
					<div className="absolute left-0 top-[calc(100%+8px)] z-20 rounded-lg bg-(--ui-surface) p-4 shadow-[0_10px_30px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-(--ui-border)">
						<DayPicker
							mode="single"
							selected={selectedDate}
							onSelect={handleSelect}
							showOutsideDays={true}
							classNames={{
								month: "space-y-4",
								caption_label: "text-(--ui-text) font-bold text-center",
								nav: "absolute left-0 right-0 top-0 flex justify-between px-[6px] z-10 items-center h-7",
								button_previous: "h-7 w-7 bg-transparent p-0 !text-[#7C5DFA] transition-colors cursor-pointer flex items-center justify-center outline-none [&>svg]:w-5 [&>svg]:h-5 [&_svg]:!stroke-[#7C5DFA] [&_path]:!stroke-[#7C5DFA] [&_svg]:!fill-[#7C5DFA] [&_path]:!fill-[#7C5DFA]",
								button_next: "h-7 w-7 bg-transparent p-0 !text-[#7C5DFA] transition-colors cursor-pointer flex items-center justify-center outline-none [&>svg]:w-5 [&>svg]:h-5 [&_svg]:!stroke-[#7C5DFA] [&_path]:!stroke-[#7C5DFA] [&_svg]:!fill-[#7C5DFA] [&_path]:!fill-[#7C5DFA]",
								months: "relative mt-2",
								month_caption: "flex justify-center items-center h-7 mb-6",
								month_grid: "w-full",
								weekdays: "hidden",
								weeks: "grid grid-cols-7 gap-1 mt-2 w-full",
								week: "contents",
								day: "p-0 flex items-center justify-center",
								day_button: "h-10 w-10 font-bold text-[15px] text-(--ui-text) transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center rounded-full hover:text-[#7C5DFA] hover:bg-[#7C5DFA]/10 outline-none",
							}}
							modifiersClassNames={{
								selected: "[&>button]:!text-[#7C5DFA]",
								today: "[&>button]:!text-[#7C5DFA]",
								outside: "[&>button]:!text-(--ui-muted) [&>button]:!opacity-40 [&>button]:pointer-events-none",
								disabled: "[&>button]:!text-(--ui-muted) [&>button]:!opacity-40 [&>button]:!cursor-not-allowed",
								hidden: "invisible",
							}}
						/>
					</div>
				) : null}
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
