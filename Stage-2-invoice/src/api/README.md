# API Layer (Frontend Adapter)

This folder contains a frontend data-access abstraction for invoices.

Goal:
- Keep UI components independent from storage details
- Start with LocalStorage/IndexedDB
- Swap to real HTTP backend later with minimal UI changes

Planned files:
- invoiceApi.ts
- storageAdapter.ts
