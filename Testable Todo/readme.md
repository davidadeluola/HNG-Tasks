# Testable Todo Item Card

A modern, accessible, and highly testable **Todo Card component** designed for automated testing environments. This project focuses on semantic HTML, WCAG-compliant accessibility, and robust `data-testid` implementation for CI/CD validation.

---

## 🚀 Key Features

- **Test-Driven Architecture:** Includes specific `data-testid` attributes on all interactive and data-driven elements (e.g., `test-todo-card`, `test-todo-complete-toggle`) for seamless integration with Playwright, Cypress, or Vitest.
- **A11y First:** Built with semantic tags (`<article>`, `<time>`, `<button>`), proper ARIA labels, and full keyboard navigation support (Tab sequence: checkbox → edit → delete).
- **Dynamic Time Tracking:** Features a relative time-remaining indicator (e.g., "Due in 3 days", "Overdue by 2 hours") calculated from a fixed deadline.
- **Responsive Design:** Mobile-first layout that scales elegantly from 320px to 1200px using CSS Flexbox.
- **Interactive States:** Functional checkbox toggle with visual "Done" states (strike-through) and status updates.

## 📋 Data Attributes (Test IDs)

To facilitate automated grading and testing, the following selectors are implemented:

| Element            | Data Test ID                              |
| :----------------- | :---------------------------------------- |
| **Root Container** | `data-testid="test-todo-card"`            |
| **Title**          | `data-testid="test-todo-title"`           |
| **Description**    | `data-testid="test-todo-description"`     |
| **Priority**       | `data-testid="test-todo-priority"`        |
| **Due Date**       | `data-testid="test-todo-due-date"`        |
| **Remaining Time** | `data-testid="test-todo-time-remaining"`  |
| **Status**         | `data-testid="test-todo-status"`          |
| **Checkbox**       | `data-testid="test-todo-complete-toggle"` |
| **Tags List**      | `data-testid="test-todo-tags"`            |
| **Edit Button**    | `data-testid="test-todo-edit-button"`     |
| **Delete Button**  | `data-testid="test-todo-delete-button"`   |

## 🛠 Technical Implementation

- **Semantics:** Uses `<article>` for the card root and `<time>` for date-related content.
- **Accessibility:** Ensure WCAG AA color contrast, visible focus rings, and accessible names for icon-only buttons.
- **Responsiveness:** No horizontal overflow; tags utilize `flex-wrap` for multi-line support on small screens.

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/username/HNG-Tasks.git
    ```
2.  **Open the project:**
    Simply open `index.html` in any modern web browser.
3.  **Live Site:**
    [Insert Live URL Here]

## ✅ Acceptance Criteria

- [ ] All required `data-testid` elements are present.
- [ ] Checkbox is keyboard-focusable and toggleable.
- [ ] Time-remaining calculation is accurate (± 5 mins).
- [ ] Semantic HTML markers (label, time, button) are used correctly.
- [ ] Responsive behavior confirmed from 320px to 1200px.
