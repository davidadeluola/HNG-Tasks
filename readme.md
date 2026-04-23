# HNG Tasks

A structured repository for HNG internship tasks, frontend challenges, and practical project submissions.

## Overview

This repository is the main workspace for HNG-related submissions.
Each task is isolated in its own folder to keep implementation, review, and execution straightforward.

Each task folder typically contains:
- source files for the implementation
- styling and interaction logic
- task-specific documentation

The goal of this structure is to make assessment, collaboration, and portfolio presentation straightforward.

## Repository Structure

- Testable Todo/
  - Accessible and testable Todo Item Card component
  - Expanded and updated with richer interactivity, responsive behavior, and accessibility refinements
  - Task README was also updated to reflect the latest scope and implementation details
- Stage-1-task-1b/
  - Accessible Profile Card component with local image upload and localStorage persistence
  - Includes semantic HTML, responsive flex layout, and JavaScript image handling
- Stage-2-invoice/
  - React + TypeScript Invoice Management App
  - CRUD, status filtering, draft flow, mark-as-paid flow, and theme toggling
  - Hybrid browser persistence using LocalStorage + IndexedDB
  - Responsive landing and dashboard experiences
  - Optional Node/Express API path in scripts/express-api for full-stack progression

## Stage 2 (Invoice) - Latest Work

Recent work completed for Stage-2-invoice includes:

- Stabilized form input IDs using React useId for consistent accessibility wiring
- Fixed build blockers and TypeScript issues that previously failed production builds
- Added modal keyboard focus trapping and focus restoration for better accessibility
- Enforced status guard logic so paid invoices cannot regress during update flow
- Added optional Node/Express backend scaffold with invoice REST endpoints and file-based persistence
- Updated project documentation to explain frontend-first mode versus optional full-stack mode

Current Stage 2 delivery model:

- Default runtime: frontend-first (Vite + React, browser persistence)
- Optional full-stack mode: run Express API via npm scripts and connect frontend when needed

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/username/HNG-Tasks.git
```

2. Enter the project folder:

```bash
cd HNG-Tasks
```

3. Open a task folder (example):

```bash
cd "Testable Todo"
```

4. Run locally:

Open `index.html` in your browser.

## Current Tasks

| Task | Folder | Description |
| :--- | :----- | :---------- |
| Testable Todo Item Card | Testable Todo | A modern, accessible Todo card component with `data-testid` support for automated testing |
| Profile Card Component | Stage-1-task-1b | A responsive profile card with uploadable avatar, local image default, and localStorage support |
| Invoice Management App | Stage-2-invoice | A responsive React invoice app with CRUD, status workflows, theme support, hybrid persistence, and an optional Express backend path |

## Notes

- Replace `username` in the clone URL with your actual GitHub username.
- Add new HNG tasks as separate folders at the repository root.
- Stage 2 detailed notes and setup are documented in Stage-2-invoice/readme.md.
