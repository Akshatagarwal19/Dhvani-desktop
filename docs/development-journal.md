# Dhvani Development Journal

---

# Session 1
**Date:** 27 June 2026

## Sprint Goal
Set up the foundation for Dhvani as a native desktop application and establish a clean project architecture.

---

## Completed

### Project Setup
- Initialized the project using Electron-Vite with React and TypeScript.
- Migrated from the original React + Vite web application to an Electron desktop application.
- Selected npm as the package manager.
- Configured Prettier and ESLint.
- Finalized the initial project structure.

### Architecture Decisions
- Adopted Electron-Vite as the project foundation.
- Kept Electron's default structure:
  - `main/`
  - `preload/`
  - `renderer/`
- Chose a feature-based organization inside the renderer.
- Decided to avoid unnecessary folders until they are actually required.
- Chose SQLite for local storage (implementation in a later sprint).

### UI Foundation
Created the first application shell consisting of:
- MainLayout
- Sidebar
- Header
- Library Page
- Dashboard Page
- Duplicates Page
- Settings Page

Implemented the basic desktop layout:
- Sidebar
- Header
- Main content area

### Infrastructure
- Restored the Electron Main Process after temporary debugging changes.
- Restored the preload foundation.
- Cleaned the TypeScript configuration by removing unused `baseUrl` and `paths`.
- Verified:
  - `npm run dev`
  - `npm run typecheck`

Both completed successfully.

---

## Problems Encountered

### Git Repository
While scaffolding Electron-Vite, the local `.git` directory was accidentally removed.

Resolution:
- Reinitialized the repository.
- Reconnected it to GitHub.
- Restored the project history.

### Electron Foundation
During debugging, the Main Process was simplified which left:

```ts
preload: undefined
```

This was later restored using the proper Electron Toolkit configuration.

### TypeScript
Encountered a deprecation warning regarding `baseUrl`.

Resolution:
- Investigated whether path aliases were actually being used.
- Determined they were unused.
- Removed unnecessary configuration instead of suppressing the warning.

---

## Lessons Learned

- Electron applications have three clearly separated layers:
  - Main Process
  - Preload
  - Renderer

- Keep the project architecture simple until additional complexity is justified.

- Infrastructure should be completed before implementing application features.

- Major tooling changes should always be committed before proceeding further.

- Remove unused configuration instead of keeping it "just in case."

---

## Decisions Locked

### Project Structure

```
src/
├── main/
├── preload/
└── renderer/
    └── src/
        ├── assets/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── types/
```

### Development Principles

- One feature per sprint.
- Keep the project simple.
- Avoid unnecessary abstractions.
- Build only what is currently needed.
- Finish one feature before starting another.

---

## Current Status

Foundation Complete ✅

Current UI:
- Sidebar
- Header
- Library Page
- Desktop layout

Electron foundation:
- Working

TypeScript:
- Clean

Git:
- Restored

Application launches successfully.

---

## Next Sprint

### Feature
Native Folder Picker

### Objective

Allow the user to:

- Click **Select Music Folder**
- Open the native Windows folder picker
- Return the selected folder path
- Display the selected path in the Library page

This will be the first feature that connects the Renderer, Preload, and Main processes through Electron IPC.

---