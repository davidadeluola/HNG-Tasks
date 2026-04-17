# Testable Todo Item Card

A modern, accessible, and testable Todo Card component built for automated testing environments. The project focuses on semantic HTML, WCAG-aligned accessibility, and robust `data-testid` implementation.

## Update Note

This README has been expanded and updated to reflect the latest improvements in the Testable Todo implementation, including richer UI behavior, stronger accessibility support, and clearer testing guidance.

## Key Features

- Test-driven structure: includes targeted `data-testid` attributes on interactive and data-driven elements for tools like Playwright, Cypress, and Vitest.
- Accessibility first: semantic tags (`<article>`, `<time>`, `<button>`), ARIA labels, visible focus states, and keyboard-friendly controls.
- Dynamic time tracking: relative remaining-time text (for example, "Due tomorrow" or "Overdue by 2 hours") derived from a fixed due date.
- Responsive layout: mobile-first design that scales cleanly from small to large screens.
- Interactive behavior: completion toggle updates visual and status state, with Edit and Delete action controls.

## Data Attributes (Test IDs)

To support automated grading and end-to-end testing, the following selectors are implemented:

| Element | Data Test ID |
| :------ | :----------- |
| Root Container | `data-testid="test-todo-card"` |
| Title | `data-testid="test-todo-title"` |
| Description | `data-testid="test-todo-description"` |
| Priority | `data-testid="test-todo-priority"` |
| Due Date | `data-testid="test-todo-due-date"` |
| Remaining Time | `data-testid="test-todo-time-remaining"` |
| Status | `data-testid="test-todo-status"` |
| Checkbox | `data-testid="test-todo-complete-toggle"` |
| Tags List | `data-testid="test-todo-tags"` |
| Edit Button | `data-testid="test-todo-edit-button"` |
| Delete Button | `data-testid="test-todo-delete-button"` |

## Technical Implementation

- Semantics: uses `<article>` for the card container and `<time>` for date content.
- Accessibility: WCAG-friendly contrast, focus-visible rings, and accessible names for controls.
- Responsiveness: no horizontal overflow on small viewports; tags wrap using `flex-wrap`.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/username/HNG-Tasks.git
```

2. Enter the task folder:

```bash
cd "HNG-Tasks/Testable Todo"
```

3. Run locally:

Open `index.html` in any modern browser.

## Acceptance Criteria

- [x] All required `data-testid` elements are present.
- [x] Checkbox is keyboard-focusable and toggleable.
- [x] Time-remaining calculation is accurate at render time (within normal client clock variance).
- [x] Semantic HTML markers (`label`, `time`, `button`) are used correctly.
- [x] Responsive behavior works from mobile to desktop sizes.
