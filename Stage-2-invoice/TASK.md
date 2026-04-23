# Stage 2 Task Plan - Invoice Management App

## Objective
Build a responsive Invoice Management App with React + TypeScript (no Express backend), based on the provided design system and Figma references.

## Tech Direction
- Frontend: React + TypeScript + Vite
- State: React Context + reducer or feature-level hooks
- Routing: React Router
- Persistence: LocalStorage and optional IndexedDB fallback
- Validation: Zod or custom schema validators
- Styling: CSS modules or scoped CSS with design tokens
- Backend: Not required for this phase (lean frontend-first architecture)

## Required Features Checklist

### 1) CRUD
- [ ] Create invoice
- [ ] View invoice list
- [ ] View invoice details
- [ ] Edit invoice
- [ ] Delete invoice with confirmation modal

### 2) Form Validation
- [ ] Required fields validated
- [ ] Error message per invalid field
- [ ] Visual error states
- [ ] Block submit on invalid data
- [ ] Client name required
- [ ] Valid client email
- [ ] At least one invoice item
- [ ] Quantity and price > 0

### 3) Status Flow
- [ ] Save draft
- [ ] Edit draft later
- [ ] Mark pending as paid
- [ ] Prevent paid -> draft regression
- [ ] Status badge consistent in list and details

### 4) Filter by Status
- [ ] Filter options: All, Draft, Pending, Paid
- [ ] Instant update on selection
- [ ] Empty state when no match

### 5) Theme Toggle
- [ ] Global light/dark mode
- [ ] All components adapt
- [ ] Persist preference in LocalStorage
- [ ] Maintain accessible contrast

### 6) Responsive Layout
- [ ] Mobile 320px+
- [ ] Tablet 768px+
- [ ] Desktop 1024px+
- [ ] No horizontal overflow
- [ ] Usable invoice form on small screens

### 7) Hover and Interaction States
- [ ] Buttons
- [ ] Links
- [ ] Invoice rows/cards
- [ ] Filters
- [ ] Inputs and controls

## Accessibility Requirements
- [ ] Semantic HTML landmarks and sections
- [ ] Labels linked to form controls
- [ ] Use button elements for actions
- [ ] Delete modal traps focus
- [ ] Modal closes with ESC
- [ ] Keyboard navigable controls
- [ ] WCAG AA contrast targets

## Suggested Lean Modular Architecture

```text
Stage-2-invoice/
  public/
  scripts/
    README.md
  src/
    api/
      README.md
      invoiceApi.ts
      storageAdapter.ts
    components/
      InvoiceList/
      InvoiceDetail/
      InvoiceForm/
      StatusBadge/
      StatusFilter/
      ThemeToggle/
      Modal/
    context/
      ThemeContext.tsx
      InvoiceContext.tsx
    hooks/
      useInvoices.ts
      useTheme.ts
    pages/
      InvoicesPage.tsx
      InvoiceDetailPage.tsx
    types/
      invoice.ts
    utils/
      validators.ts
      formatters.ts
      constants.ts
    styles/
      tokens.css
      globals.css
    App.tsx
    main.tsx
  TASK.md
  readme.md
```

## Hybrid Data Layer (Frontend-Only)
Use an adapter pattern so data source can change later without refactoring UI.

- `invoiceApi.ts`: App-facing CRUD methods (`getAll`, `create`, `update`, `remove`, `markAsPaid`)
- `storageAdapter.ts`: Storage implementation (LocalStorage now, IndexedDB optional)
- Later upgrade path: replace adapter internals with remote API calls when backend is introduced

## Step-by-Step Build Plan

### Phase 1: Foundation
- [ ] Clean Vite starter files
- [ ] Add route skeleton
- [ ] Add type definitions for invoice model
- [ ] Add design tokens from approved design system

### Phase 2: Data Layer
- [ ] Build storage adapter with LocalStorage
- [ ] Seed demo invoices for development
- [ ] Implement invoice API abstraction

### Phase 3: Core UI
- [ ] Build invoice list page
- [ ] Build invoice details page
- [ ] Build status badge and filter controls

### Phase 4: Form and Validation
- [ ] Build create/edit invoice form
- [ ] Add client and item validations
- [ ] Add draft and submit flows

### Phase 5: Actions and Modal
- [ ] Add delete confirmation modal
- [ ] Add mark as paid flow
- [ ] Add hover/focus states

### Phase 6: Theme and Responsiveness
- [ ] Implement theme context and persistence
- [ ] Complete responsive breakpoints
- [ ] Verify contrast and keyboard interactions

### Phase 7: QA and Delivery
- [ ] Check console for errors/warnings
- [ ] Run lint and build
- [ ] Document architecture and trade-offs in project README
- [ ] Deploy to Vercel/Netlify

## Notes for Upcoming Design Integration
- Keep component structure stable and map exact spacing, sizes, and state colors from your image references when you share them.
- Avoid hardcoded values; map Figma values to reusable tokens.
- Keep status and theme colors centralized in token files.
