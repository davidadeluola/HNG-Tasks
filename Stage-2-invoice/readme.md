# Frontend Wizards Stage 2 - Invoice Management App

A responsive React + TypeScript invoice management application focused on real invoice workflows:
- Create, view, update, and delete invoices
- Save invoices as draft
- Mark invoices as paid
- Filter invoices by status
- Toggle light and dark themes
- Persist data with LocalStorage + IndexedDB (hybrid adapter)

This submission also includes a marketing landing page as an enhancement beyond the core dashboard requirements.

## Recent Enhancements (Responsive Polish & Design System)

The application has undergone a significant "Technical Brutalist" visual and structural refinement to ensure a premium experience across all devices:

- **Strict Typography System**: Implemented a robust utility-based typography system using **League Spartan** tokens. Headings (L, M, S) and Body styles strictly follow the design system for font size, line height, and letter-spacing.
- **Mobile-First Refinement**: Re-engineered the Dashboard and Invoice Details for extreme mobile accessibility (320px+). This includes:
  - **Sticky Action Bars**: Action buttons move to a high-contrast sticky footer on mobile for easy thumb reach.
  - **Grid Optimization**: Invoice cards and info sections use a dynamic 2-row grid on small screens and transition to a multi-column horizontal layout on desktop.
- **Layout Stabilization**: Optimized the container logic to handle ultra-wide screens (1440px+), ensuring content remains centered and proportional without "stretching" bugs.
- **UX Stability**: Resolved keyboard focus issues in the Create/Edit modal to ensure seamless data entry.
- **Dynamic Contextual Labels**: Responsive UI elements (like "Filter" vs "Filter by status") that adapt their context based on available screen real estate.

## Stage Narrative (Presentation Voice)

This build delivers a production-style invoice workflow in React, centered around clean UI, modular structure, and durable client-side persistence. The app supports end-to-end invoice management from creation to payment, while preserving theme and data state across sessions. It is designed to be easy to maintain and straightforward to extend toward a backend-powered architecture.

## Tech Stack

- React 19 + TypeScript + Vite
- React Router
- Tailwind CSS v4 utilities + design tokens
- Context API for invoice and theme state
- IndexedDB (`idb`) + LocalStorage hybrid persistence
- **Full Design Tokenization**: Eliminated hardcoded hex values in favor of a unified CSS variable system, ensuring perfect theme consistency and maintainability.

## Full-Stack Note (Express Option)

By default, the current app runs as a frontend-first architecture with browser persistence.

To make it fully full-stack, this branch adds a Node/Express API option in `scripts/express-api/server.mjs`.
That gives you:
- React frontend
- Express backend API
- Server-side persisted invoice data (JSON store)

**Important Production Note:** The Express backend relies on writing to a local `invoices.json` file on the disk. Because of this, it is intentionally **not connected** to the frontend by default. Serverless hosting platforms like Vercel use ephemeral, read-only filesystems that will crash or immediately lose data when attempting to write to local files. We deliberately chose to use LocalStorage and IndexedDB as the default live data source to prevent breaking in production, ensuring a stable deployment without the overhead of provisioning a remote database (like PostgreSQL or MongoDB).

## Architecture Overview

The app is structured in a modular, feature-oriented layout:

```txt
src/
  api/
    invoiceApi.ts
    indexedDbAdapter.ts
    storageAdapter.ts
  components/
    pages/
      Landing/
      dashboard/
    shared/
    ui/
  context/
    InvoiceContext.tsx
    ThemeContext.tsx
  hooks/
    useInvoiceForm.ts
    useInvoices.ts
    useTheme.ts
  layouts/
    app/AppLayout.tsx
  pages/
    LandingPage.tsx
    DashboardPage.tsx
    InvoiceDetailsPage.tsx
  routes/
    AppRoutes.tsx
  types/
  utils/
    constants.ts
    validators.ts
    formatters.ts
```

## Data Flow

1. UI components dispatch actions through `useInvoices` and `InvoiceContext`.
2. Context calls `invoiceApi` methods (`getAll`, `create`, `update`, `remove`, `markAsPaid`).
3. `invoiceApi` uses `hybridStorageAdapter` for persistence.
4. `hybridStorageAdapter` syncs across LocalStorage and IndexedDB.
5. UI reacts to updated context state and re-renders list/details views.

## Requirement Coverage (Audit)

### 1) CRUD

- Create invoice: Implemented via `CreateInvoiceModal`.
- Read list and details: Implemented on dashboard and invoice details page.
- Update invoice: Implemented via edit mode in modal.
- Delete invoice: Implemented with confirmation modal.

Status: Mostly complete.

### 2) Form Validation

Implemented validations include:
- Client name required
- Client email required + format check
- Description required
- Invoice date required
- At least one item
- Item name required
- Quantity > 0
- Price > 0

Status: Complete for declared required fields.

### 3) Draft and Payment Flow

Implemented:
- Save as draft
- Save as pending
- Mark pending as paid
- Status badges in list and details

Important gap:
- A paid invoice can currently be edited and saved as pending (regression from paid).

Status: Partially complete (1 logic rule gap).

### 4) Filter by Status

- Checkbox-style status filter implemented (`draft`, `pending`, `paid`)
- Immediate list update
- Empty state when filtered result is empty

Status: Complete.

### 5) Light/Dark Mode

- Global theme toggle implemented
- Theme persisted in LocalStorage
- Design tokens adapt surfaces/text/borders for both themes

Status: Complete.

### 6) Responsive Design

- Mobile, tablet, desktop responsive layouts are implemented across landing, dashboard, and modals
- Invoice list and forms adapt to smaller screens

Status: Complete based on implementation intent.

### 7) Hover and Interactive States

- Hover states present on buttons, links, filters, and many controls

Status: Complete.

## Accessibility Notes

Implemented:
- Semantic sections used in major page blocks
- Buttons use `<button>` elements
- Form inputs are associated with labels
- Modal closes on Escape key
- Interactive controls include descriptive `aria-label` values

Known accessibility gap:
- Modal does not currently implement full focus trapping.

## Trade-offs

- Frontend-only persistence instead of backend API:
  - Pros: faster delivery, offline-friendly, low setup complexity
  - Cons: no multi-device sync, no shared/team data, browser-storage limits
- Context-based state management:
  - Pros: simple and maintainable for current app size
  - Cons: could become heavy with larger feature growth compared to dedicated state libraries
- Hybrid IndexedDB + LocalStorage strategy:
  - Pros: resilient fallback and persistence redundancy
  - Cons: requires sync logic and conflict assumptions

## Improvements Beyond Requirements

- Added a dedicated landing page experience before dashboard flow
- Implemented hybrid storage strategy using both IndexedDB and LocalStorage
- Built reusable UI primitives (`Modal`, `Input`, `Button`, `Form`)
- Added custom date picker and status filter components for richer UX

## Current Shortfalls to Address Before Final Grading

1. Run final responsiveness and color-contrast QA on real devices and screen readers.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

5. Run optional Express API backend:

```bash
npm run api:dev
```

or:

```bash
npm run api:start
```

## Suggested Submission Checklist

- Live URL (Vercel/Netlify)
- GitHub repository URL
- README (this file)
- Architecture summary
- Trade-offs and accessibility notes
- Explicit list of known gaps and next steps
