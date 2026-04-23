# Scripts Folder

This folder is reserved for project automation scripts and local tooling.

Examples:
- Seed invoice data scripts
- Data migration scripts
- Build/deploy helper scripts
- JSON transform utilities for mock API payloads

For this stage, keep scripts lightweight and frontend-focused.

## Optional Express API (Full-Stack Path)

This repository now includes an optional Node/Express API under `scripts/express-api/`.

Use it when you want the app to behave as a true full-stack project (frontend + backend API + persisted server-side data file):

1. `npm run api:dev` for watch mode
2. `npm run api:start` for normal mode

API base URL: `http://localhost:4000/api`

Available endpoints:
- `GET /api/health`
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `POST /api/invoices`
- `PUT /api/invoices/:id`
- `PATCH /api/invoices/:id/mark-paid`
- `DELETE /api/invoices/:id`
