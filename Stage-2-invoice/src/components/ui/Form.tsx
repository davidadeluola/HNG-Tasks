import type { FormHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  title?: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

type FormSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

type FormGridProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
};

type FormActionsProps = {
  children: ReactNode;
  className?: string;
};

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={twMerge("rounded-[10px] border border-(--color-border-soft) bg-(--ui-surface) p-6 shadow-[0_10px_20px_rgba(72,84,159,0.08)]", className)}>
      {(title || description) ? (
        <header className="mb-5 space-y-1">
          {title ? <h2 className="typo-heading-s text-(--color-text-subtle)">{title}</h2> : null}
          {description ? <p className="typo-body-variant text-(--color-text-subtle)">{description}</p> : null}
        </header>
      ) : null}
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const columnClassName =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return <div className={twMerge("grid gap-4", columnClassName, className)}>{children}</div>;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <footer className={twMerge("flex flex-wrap items-center justify-end gap-3 border-t border-(--color-border-soft) pt-5", className)}>
      {children}
    </footer>
  );
}

export default function Form({
  title,
  description,
  headerAction,
  children,
  footer,
  className,
  ...props
}: FormProps) {
  return (
    <form
      className={twMerge(
        "rounded-[12px] border border-(--color-border-soft) bg-(--ui-surface) p-6 shadow-[0_20px_50px_rgba(72,84,159,0.12)]",
        className,
      )}
      {...props}
    >
      {(title || description || headerAction) ? (
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? <h1 className="typo-heading-m text-(--color-surface-dark)">{title}</h1> : null}
            {description ? <p className="typo-body text-(--color-text-subtle)">{description}</p> : null}
          </div>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </header>
      ) : null}

      <div className="grid gap-6">{children}</div>

      {footer ? <div className="mt-6">{footer}</div> : null}
    </form>
  );
}
