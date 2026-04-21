import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariant =
  | "primary"
  | "markPaid"
  | "edit"
  | "saveDraft"
  | "delete"
  | "addItem"
  | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-primary) text-white hover:bg-(--color-primary-hover) focus-visible:ring-(--color-primary)",
  markPaid:
    "bg-(--color-primary) text-white hover:bg-(--color-primary-hover) focus-visible:ring-(--color-primary)",
  edit: "bg-(--color-surface-soft) text-(--color-text-subtle) hover:bg-(--color-border-soft) focus-visible:ring-(--color-text-subtle) dark:bg-(--color-surface-dark-hover) dark:text-(--color-border-soft) dark:hover:bg-(--color-surface-dark) dark:hover:text-(--color-text-subtle)",
  saveDraft:
    "bg-(--color-surface-dark-hover) text-(--color-text-muted) hover:bg-(--color-bg-dark-deep) hover:text-(--color-border-soft) focus-visible:ring-(--color-surface-dark-hover) dark:bg-(--color-surface-dark-hover) dark:text-(--color-border-soft) dark:hover:bg-(--color-surface-dark)",
  delete:
    "bg-(--color-danger) text-white hover:bg-(--color-danger-soft) focus-visible:ring-(--color-danger)",
  addItem:
    "bg-(--color-surface-soft) text-(--color-text-subtle) hover:bg-(--color-border-soft) focus-visible:ring-(--color-text-subtle) dark:bg-(--color-surface-dark-hover) dark:text-(--color-border-soft) dark:hover:bg-(--color-surface-dark)",
  ghost:
    "border border-(--color-border-soft) bg-(--color-surface-soft) text-(--color-text-subtle) hover:border-(--color-border-soft) hover:bg-(--color-border-soft) focus-visible:ring-(--color-text-subtle)  dark:bg-(--color-surface-dark-hover) dark:text-(--color-border-soft) dark:hover:bg-(--color-surface-dark) dark:hover:text-white",
};

function Button({
  variant = "primary",
  className,
  children,
  leftIcon,
  type = "button",
  ...props
}: ButtonProps) {
  const layoutClasses =
    variant === "primary"
      ? "h-12 min-w-[160px] gap-2 rounded-full pl-1.5 pr-6"
      : variant === "edit"
      ? "h-12 gap-2 rounded-full px-7"
      : "h-12 gap-2 rounded-full px-6";

  const resolvedLeftIcon =
    leftIcon === undefined && variant === "primary" ? (
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-bold leading-none text-(--color-primary)"
      >
        <span className="-translate-y-px text-xl leading-none">+</span>
      </span>
    ) : (
      leftIcon
    );

  return (
    <button
      type={type}
      className={twMerge(
        "inline-flex items-center justify-center text-[15px] font-bold tracking-[-0.25px] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        layoutClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {resolvedLeftIcon}
      <span>{children}</span>
    </button>
  );
}

export default Button;
