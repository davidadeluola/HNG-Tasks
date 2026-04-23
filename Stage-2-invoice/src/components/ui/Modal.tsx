import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type ModalPlacement = "center" | "left" | "right";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  placement?: ModalPlacement;
  closeOnOverlayClick?: boolean;
  className?: string;
  panelClassName?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  placement = "right",
  closeOnOverlayClick = true,
  className,
  panelClassName,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousActiveElementRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const selector = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const panel = panelRef.current;
    const focusables = panel ? Array.from(panel.querySelectorAll<HTMLElement>(selector)) : [];
    const initialTarget = focusables[0] ?? panel;
    initialTarget?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const currentPanel = panelRef.current;
      if (!currentPanel) {
        return;
      }

      const nodes = Array.from(currentPanel.querySelectorAll<HTMLElement>(selector));
      if (nodes.length === 0) {
        event.preventDefault();
        currentPanel.focus();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={twMerge("fixed inset-0 z-50", className)}>
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"
        onClick={() => {
          if (closeOnOverlayClick) {
            onClose();
          }
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={twMerge(
          "pointer-events-none absolute inset-0 flex",
          placement === "center"
            ? "items-center justify-center p-4 md:p-6"
            : placement === "left"
            ? "items-stretch justify-start md:pr-6"
            : "items-stretch justify-end pl-4 md:pl-6",
        )}
      >
        <section
          ref={panelRef}
          tabIndex={-1}
          className={twMerge(
            "pointer-events-auto flex w-full flex-col overflow-hidden rounded-r-[18px] border border-(--ui-border) bg-(--ui-bg) shadow-[0_30px_80px_rgba(0,0,0,0.28)]",
            placement === "center" ? "max-w-3xl" : "h-full max-w-4xl",
            panelClassName,
          )}
        >
          {(title || description) ? (
            <header className="flex items-start justify-between gap-4 border-b border-(--ui-border) px-5 py-4 md:px-7 md:py-5">
              <div className="space-y-1">
                {title ? (
                  <h2 id={titleId} className="typo-heading-m py-6  text-(--ui-text)">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p id={descriptionId} className="typo-body text-(--ui-muted)">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--ui-border) text-(--ui-muted) transition-colors duration-200 ease-out hover:border-(--color-primary-hover) hover:text-(--color-primary)"
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.25} />
              </button>
            </header>
          ) : null}

          <div className="modal-scroll min-h-0 flex-1 overflow-y-auto p-5 md:p-7">{children}</div>
        </section>
      </div>
    </div>,
    document.body,
  );
}