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
# Session 2 – Native Folder Picker

**Date:** 27 June 2026

## Sprint Goal
Implement the first native desktop feature by allowing the user to select a music folder using the Windows folder picker.

---

## Completed

### Electron IPC
Successfully implemented communication between:
- Renderer Process
- Preload Script
- Main Process

using Electron IPC.

### Native Folder Picker
- Added a "Select Music Folder" button to the Library page.
- Opened the native Windows folder selection dialog.
- Returned the selected folder path to the renderer.
- Displayed the selected folder path in the UI.

### Infrastructure Improvements
- Restored the Electron Main Process after the temporary debugging setup.
- Restored proper preload configuration.
- Cleaned the TypeScript configuration by removing unused `baseUrl` and `paths`.
- Verified the project with:
  - `npm run dev`
  - `npm run typecheck`

---

## Challenges

- Restoring the Electron foundation without breaking the existing application.
- Understanding the complete Electron communication flow between the Main Process, Preload Script and Renderer.

---

## Lessons Learned

- Electron applications communicate using IPC.
- The Renderer should never directly access native APIs.
- The Preload Script acts as a secure bridge between the UI and the Main Process.
- Building and verifying one layer at a time makes debugging much easier.

---

## Milestone Achieved

The first native desktop feature of Dhvani is now complete.

The application can successfully communicate with the operating system and receive data back into the React application.

---

## Next Sprint

### Feature
Music Library Scanner

### Objectives
- Read the selected folder.
- Detect supported audio files.
- Display the list of songs in the Library page.
- Ignore unsupported files.

This will be the first step toward building Dhvani's music library.
# Session 3 – Music Library Scanner

**Date:** 27 June 2026

## Sprint Goal
Scan the selected music folder and display supported audio files.

---

## Completed

- Added folder scanning using Node.js `fs/promises`.
- Filtered supported audio formats:
  - MP3
  - FLAC
  - WAV
  - M4A
  - AAC
  - OGG
- Displayed the scanned tracks in the Library page.
- Introduced the `Track` model in the renderer.
- Displayed the total number of tracks.
- Sorted tracks alphabetically before displaying them.

---

## Lessons Learned

- Electron IPC can be reused for different native operations.
- The Main Process should focus on filesystem operations.
- The Renderer should transform raw filesystem data into application models.
- Building one layer at a time makes debugging much easier.

---

## Next Sprint

Read embedded metadata from audio files.

Display:
- Title
- Artist
- Album
- Duration

instead of only filenames.

# Sprint 4 – Metadata Reader

**Date:** 27 June 2026

## Sprint Goal

Read embedded metadata from supported audio files and display meaningful music information instead of only filenames.

---

## Features Implemented

* Integrated the `music-metadata` library.
* Read metadata for all supported audio files.
* Extracted:

  * Title
  * Artist
  * Album
  * Duration
* Added graceful fallbacks for missing metadata.
* Displayed formatted metadata in the Library page.
* Created a reusable duration formatting utility.
* Continued using Electron IPC for communication between the renderer and main process.

---

## Design Decisions

* Kept the existing project structure instead of introducing a `shared` folder.
* Decided to postpone project restructuring until multiple shared models exist.
* Chose to keep feature development and architectural refactoring as separate efforts.

---

## Lessons Learned

* `music-metadata` provides much richer information than initially expected, including artwork, bitrate, sample rate, genre, and year.
* Building features one verified layer at a time (Main → Preload → Renderer → UI) greatly simplifies debugging.
* Returning richer objects from the main process simplifies renderer logic.

---

## Product Decisions

* Dhvani is being developed as a **Music Library Manager**, not just a duplicate finder.
* Metadata management is considered a core capability.
* Editing metadata will be prioritized before duplicate detection.

---

## Next Sprint

Focus on completing metadata support by expanding available fields and preparing the application for metadata editing.
# Sprint 5 – Metadata Editor

**Date:** 28 June 2026

## Sprint Goal

Allow users to edit and save metadata for individual music tracks.

---

## Features Implemented

* Added track selection.
* Displayed editable metadata fields.
* Integrated `music-tag-native` for writing metadata.
* Implemented IPC communication for saving metadata.
* Updated Title, Artist, and Album tags.
* Successfully wrote metadata changes back to the original music files.

---

## Design Decisions

* Continued keeping the project architecture simple.
* Delayed introducing shared types and additional components until they are genuinely needed.
* Focused only on Title, Artist, and Album for Version 1.

---

## Lessons Learned

* `music-tag-native` provides a clean API through the `MusicFile` class.
* Separating the implementation into Main Process → Preload → Renderer made debugging straightforward.
* Verifying changes in external applications confirmed that metadata was actually written to disk.

---

## Milestone

Dhvani is now capable of both reading and writing music metadata.

This marks the transition from a metadata viewer to a functional music library editor.

---

## Next Sprint

Duplicate Detection

* Identify duplicate songs.
* Group potential duplicates.
* Display duplicate candidates without modifying any files.

# Sprint 6 – Duplicate Detection

**Date:** 29 June 2026

## Sprint Goal

Implement duplicate song detection to help identify multiple copies of the same track within the user's music library.

---

## Features Implemented

* Added "Find Duplicates" functionality.
* Implemented duplicate detection using:

  * Track metadata (Title + Artist)
  * Track duration
* Grouped matching tracks together for display.
* Displayed duplicate groups inside the application.

---

## Design Decisions

* Chose metadata + duration as the primary duplicate detection strategy for Version 1.
* Decided not to expose multiple detection modes (Filename, Metadata, Metadata + Duration) in the UI.
* Kept the implementation inside `LibraryPage.tsx` to avoid unnecessary abstraction during Version 1 development.

---

## Lessons Learned

* Metadata is significantly more reliable than filenames because filenames may have been edited manually over time.
* Using a `Map` makes duplicate grouping straightforward and efficient.
* Building the duplicate detection engine first allows the UI to evolve independently.

---

## Product Decisions

Version 1 will prioritize simplicity.

Users will click a single **Find Duplicates** button without needing to choose an algorithm.

Advanced detection methods and configuration options are postponed to Version 2.

---

## Current Version 1 Progress

* ✅ Electron Foundation
* ✅ Folder Selection
* ✅ Library Scan
* ✅ Metadata Reader
* ✅ Metadata Editor
* ✅ Duplicate Detection Engine
* ⏳ UI/UX Polish
* ⏳ Music Player

---

## Next Sprint

Sprint 7 – UI/UX Polish

Focus Areas:

* Improve overall application layout.
* Replace the temporary development UI.
* Create a cleaner library view.
* Improve spacing, typography and colors.
* Prepare the interface for the integrated music player.
* Make Dhvani feel like a polished desktop application while preserving its lightweight nature.

Sprint 7 – UI Foundation

Date: 29 June 2026

Sprint Goal

Improve Dhvani's user interface so that it feels like a desktop application while keeping the focus on Version 1 functionality.

Features Implemented
Redesigned the overall application layout.
Added a dedicated sidebar with navigation placeholders.
Improved the application header.
Organized the Library page into logical sections:
Track List
Selected Track
Duplicate Groups
Introduced card-based layout for better visual separation.
Improved spacing, alignment and typography.
Styled buttons and input fields.
Added responsive two-column layout for the library and metadata editor.
Design Decisions
Focused on usability rather than visual effects.
Kept the interface lightweight and desktop-oriented.
Avoided unnecessary animations or complex styling.
Continued postponing advanced UI polish until after Version 1.
Lessons Learned
A well-structured layout greatly improves usability without changing any functionality.
Separating the page into logical UI sections makes future styling and maintenance much easier.
Good UI is not only about appearance—it should help users work faster with large music libraries.
Current Version 1 Progress
✅ Sprint 1  Electron Foundation
✅ Sprint 2  Folder Selection
✅ Sprint 3  Library Scanner
✅ Sprint 4  Metadata Reader
✅ Sprint 5  Metadata Editor
✅ Sprint 6  Duplicate Detection
✅ Sprint 7  UI Foundation

⏳ Sprint 8  Music Player
⏳ Sprint 9  Duplicate Management
⏳ Sprint 10 Build, Testing & Release

Development Journal
Sprint 8 – Basic Music Player

Date: 30 June 2026

Sprint Goal

Implement a lightweight music player that allows users to preview songs while managing their music library.

Features Implemented
Added music playback support.
Implemented Play, Pause and Stop controls.
Added playback status indicator.
Displayed currently selected track for playback.
Automatically reset playback state when audio finishes.
Prevented previous track from continuing when a different track is selected.
Disabled playback controls when no track is selected.
Technical Work
Used the native HTML Audio API for playback.
Read local audio files through Electron IPC.
Converted audio data into browser-compatible Blob objects.
Updated Content Security Policy (CSP) to allow media playback.
Successfully played local music files inside Electron.
Challenges Faced

During implementation we encountered several Electron-specific issues:

Direct Windows file paths could not be loaded by the renderer.
Browser security blocked access to local media files.
Content Security Policy prevented playback of Blob URLs.
Electron IPC required transferring binary audio data from the main process to the renderer.

Each issue was investigated individually until playback was successfully achieved.

Known Issues
Minor TypeScript typing warning while creating a Blob from the IPC-returned Uint8Array.
This does not affect runtime functionality.
Planned to be resolved during Sprint 10 (Final Polish).
Design Decisions
Chose the native HTML Audio API instead of introducing additional player libraries.
Kept the player intentionally lightweight.
Deferred advanced playback features (seek bar, playlist queue, repeat, shuffle, equalizer) to future versions.
Lessons Learned
Electron applications require different handling for local media than standard web applications.
Security mechanisms such as CSP and IPC architecture are important considerations when working with local files.
A simple implementation is often sufficient for Version 1 when the application's primary purpose is library management rather than media playback.
Current Version 1 Progress
✅ Sprint 1  Electron Foundation
✅ Sprint 2  Folder Selection
✅ Sprint 3  Library Scanner
✅ Sprint 4  Metadata Reader
✅ Sprint 5  Metadata Editor
✅ Sprint 6  Duplicate Detection
✅ Sprint 7  UI Foundation
✅ Sprint 8  Basic Music Player

⏳ Sprint 9  Duplicate Management
⏳ Sprint 10 Final Polish, Packaging & Testing
Version 1 Status

At the end of Sprint 8, Dhvani can:

✅ Scan music folders.
✅ Read song metadata.
✅ Edit and save metadata.
✅ Detect duplicate songs.
✅ Play local audio files.
✅ Present the library through a desktop interface.

Version 1 has now reached the stage where all major user-facing features exist. The remaining work focuses on completing the duplicate management workflow and polishing the overall user experience before release.

Sprint 9 – Duplicate Management

Date: 30 June 2026

Sprint Goal

Complete the duplicate management workflow by allowing users to safely remove duplicate songs from their music library.

Features Implemented
Duplicate Management
Added "Move to Recycle Bin" functionality.
Implemented confirmation dialog before moving files.
Successfully integrated Electron's native Recycle Bin support.
Verified duplicate files are moved safely instead of being permanently deleted.
Library Refresh
Introduced reusable loadLibrary() function.
Automatically reloads the library after duplicate removal.
Automatically refreshes duplicate groups after rescanning.
Removed deleted songs from the interface without requiring a manual rescan.
Duplicate Detection Improvements
Updated duplicate detection to accept an optional track list.
Eliminated state synchronization issues after library refresh.
Improved consistency between the displayed library and duplicate groups.
Design Decisions

Version 1 intentionally focuses on safe duplicate management.

Included:

Safe deletion through Windows Recycle Bin.
User confirmation before deletion.
Automatic library refresh.

Deferred to Version 2:

Permanent delete.
Batch deletion.
Automatic best-copy selection.
Advanced duplicate scoring.
Acoustic fingerprint matching.
Technical Improvements
Added reusable library loading logic.
Improved interaction between scanning and duplicate detection.
Reduced duplicated code by centralizing library refresh.
Lessons Learned
Refreshing application state immediately after filesystem operations greatly improves user experience.
Separating library loading from folder selection simplifies future maintenance.
Safety should be prioritized when an application modifies user files.
Current Version 1 Progress
✅ Sprint 1  Electron Foundation
✅ Sprint 2  Folder Selection
✅ Sprint 3  Library Scanner
✅ Sprint 4  Metadata Reader
✅ Sprint 5  Metadata Editor
✅ Sprint 6  Duplicate Detection
✅ Sprint 7  UI Foundation
✅ Sprint 8  Basic Music Player
✅ Sprint 9  Duplicate Management

⏳ Sprint 10 Final Polish, Testing & Release
Version 1 Status

Dhvani Version 1 now supports:

✅ Music library scanning.
✅ Metadata extraction.
✅ Metadata editing and saving.
✅ Duplicate song detection.
✅ Safe duplicate removal using the Windows Recycle Bin.
✅ Local music playback.
✅ Desktop-based user interface.

All core functional goals planned for Version 1 have now been implemented.
Sprint 10 – Release & Packaging

Date: 30 June 2026

Sprint Goal

Finalize Dhvani Version 1 by polishing the application, resolving remaining technical issues, configuring the Windows build process, and generating a standalone installer.

Release Improvements
Finalized user interface for Version 1.
Improved application stability and overall user experience.
Completed final code cleanup.
Removed remaining TypeScript issues.
Improved audio playback handling and resource cleanup.
Refined duplicate management workflow.
Verified metadata editing and library refresh.
Windows Packaging
Configured Electron Builder for Windows releases.
Updated application metadata (productName, appId, version information).
Created and configured application resources.
Added a custom Dhvani application icon.
Resolved Electron Builder icon compatibility requirements.
Successfully generated a standalone Windows installer.
Verified that the packaged application launches correctly outside the development environment.
Functional Verification

Verified the packaged application successfully performs:

Music folder selection
Library scanning
Metadata reading
Metadata editing
Metadata saving
Audio playback
Duplicate detection
Moving duplicate files to the Windows Recycle Bin
Automatic library refresh
Stable playback controls
Release Summary

Dhvani Version 1.0.0 delivers:

Desktop music library management
Metadata editing
Duplicate detection
Safe duplicate removal
Integrated audio playback
Native Windows installation

The application has successfully transitioned from a development project into a distributable desktop application.

Sprint Timeline
Sprint 1  ✓ Electron Foundation
Sprint 2  ✓ Folder Selection
Sprint 3  ✓ Library Scanner
Sprint 4  ✓ Metadata Reader
Sprint 5  ✓ Metadata Editor
Sprint 6  ✓ Duplicate Detection
Sprint 7  ✓ UI Foundation
Sprint 8  ✓ Basic Music Player
Sprint 9  ✓ Duplicate Management
Sprint 10 ✓ Final Polish & Windows Release

==============================

🚀 Dhvani Version 1.0.0 Released
Final Statistics
Tech Stack
Electron
React 19
TypeScript
Vite
Electron Builder
music-metadata
music-tag-native
Core Features
Folder Scanner
Metadata Editor
Audio Player
Duplicate Detection
Duplicate Removal
Native Windows Packaging
Development Methodology
10 planned sprints
Incremental feature development
Regular testing after every sprint
Version-controlled milestones
Stable Version 1 release

Version 2 - Sprint 1

Title

## Version 2 - Sprint 1

Summary

### Objectives
- Introduce multi-page application architecture.
- Begin separating Version 1 functionality into dedicated pages.
- Introduce shared application state.

### Completed

#### Navigation & Layout
- Dashboard is now the default landing page.
- Added page navigation through the Sidebar.
- Header now updates dynamically based on the active page.
- Created placeholder Dashboard, Library, Duplicates and Settings pages.

#### Shared State
- Introduced LibraryContext.
- Moved tracks into shared context.
- Moved selectedFolder into shared context.
- Moved duplicate groups into shared context.
- Added shared library loading functionality.

#### Duplicate Management Refactor
- Extracted duplicate detection algorithm into utils/findDuplicates.ts.
- Moved duplicate management UI from LibraryPage to DuplicatesPage.
- LibraryPage now focuses only on:
  - Folder selection
  - Track list
  - Metadata editing
  - Audio playback

#### Architecture Improvements
- Reduced LibraryPage responsibilities significantly.
- Improved separation of concerns.
- Established the architectural foundation for Version 2.

### Known Issues
- Duplicate detection algorithm produces false positives on large real-world music libraries.
- Duplicate list requires a manual "Find Duplicates" scan after library changes.
- Android MTP devices cannot currently be scanned because they are not exposed as standard filesystem paths.

### Notes
A real-world music library (~300 tracks copied from an Android device) will now serve as the primary benchmark

## Version 2 - Sprint 2

### Theme
Redesign the duplicate detection engine using a modular comparison-based architecture.

### Objectives
- Investigate weaknesses in the Version 1 duplicate detection algorithm.
- Test against real-world music libraries.
- Replace the key-based matching system.
- Build reusable comparison utilities.

### Completed

#### Duplicate Detection Investigation
- Benchmarked the duplicate engine using a real-world music library (~300 tracks).
- Identified false positives caused by missing metadata.
- Built a smaller benchmark playlist to validate duplicate detection.
- Logged and analyzed duplicate matching behaviour.

#### New Comparison Engine
- Replaced the key-based duplicate detection architecture.
- Introduced direct track-to-track comparison.
- Added similarity-based comparison instead of strict equality.
- Built a scoring system to evaluate duplicate confidence.

#### New Utility Modules
Created reusable utilities:

- normalizeText.ts
- normalizeFilename.ts
- compareDuration.ts
- compareTextSimilarity.ts
- compareTracks.ts

These utilities separate normalization, comparison and duplicate detection into independent modules.

#### Refactoring
- Rewrote findDuplicates.ts to use compareTracks().
- Removed dependency on generated lookup keys.
- Improved separation of concerns.

### Benchmark Results

Small benchmark playlist:
- Successfully detects obvious duplicate copies.

Large real-world library:
- Eliminated most false positives found in Version 1.
- Identified limitations caused by inconsistent metadata.
- Determined that advanced duplicate matching is outside the scope of Version 2.

### Decisions

- Perfect duplicate detection is deferred to Version 3.
- AI-assisted metadata matching will be explored in Version 3.
- Version 2 will focus on practical music library management features rather than attempting to solve every duplicate scenario.

### Lessons Learned

Real-world music collections contain inconsistent metadata, multiple releases, remasters, live versions, video uploads and copied files.

Accurate duplicate detection requires contextual understanding rather than simple string comparison. The new architecture provides a foundation for future improvements without requiring major refactoring.

## Version 2 - Sprint 3

### Theme
Improve library exploration and usability by introducing search, sorting, filtering and interface improvements.

### Objectives
- Add library search.
- Add track sorting.
- Add metadata-based filters.
- Improve the Library page interface.
- Verify support for external storage devices.

---

## Completed

### Search Engine

Implemented a reusable search engine.

Features:
- Search by title.
- Search by artist.
- Search by album.
- Search by filename (fallback).

Created:

- utils/searchTracks.ts

Search now updates the displayed track list in real time.

---

### Sorting

Implemented reusable sorting functionality.

Supported sorting:

- Title
- Artist
- Album
- Duration

Created:

- utils/sortTracks.ts

Sorting is fully separated from UI logic.

---

### Filtering

Implemented reusable metadata filters.

Supported filters:

- All Tracks
- Missing Title
- Missing Artist
- Missing Album
- Duplicate Candidates

Created:

- utils/filterTracks.ts

Duplicate filtering reuses the duplicate engine built during Sprint 2.

---

### Library Pipeline

Refactored LibraryPage into a clear processing pipeline.

tracks

↓

searchTracks()

↓

sortTracks()

↓

filterTracks()

↓

displayedTracks

Each stage has a single responsibility and can be extended independently.

---

### Context Improvements

Extended LibraryContext with shared UI state.

Added:

- searchQuery
- sortOption
- activeFilter

This removes page-specific state and prepares the application for future pages.

---

### Library UI Improvements

Improved the Library page by adding:

- Search bar
- Sort dropdown
- Filter dropdown
- Improved toolbar layout
- Selected Library information card

The interface now resembles a desktop music manager instead of a simple file viewer.

---

### External Device Support

Verified support for removable storage devices.

Confirmed working:

- Internal HDD/SSD
- USB Flash Drives
- External HDD
- External SSD
- SD Cards

Android devices connected using MTP remain outside the scope of Version 2 because they are not exposed as standard filesystem directories.

---

## Architecture Improvements

Continued the Version 2 refactoring philosophy:

- UI
- Business Logic
- Context
- Utilities

are now clearly separated.

The Library page primarily coordinates application state while reusable logic lives inside utility modules.

---

## Lessons Learned

Building reusable processing stages (Search → Sort → Filter) makes future features significantly easier to implement.

Real-world testing with a personal music library exposed usability improvements that were not obvious during initial planning, leading to a more practical roadmap for Dhvani.

---

## Sprint Outcome

The Library page has evolved from a basic folder scanner into a functional music library explorer capable of searching, sorting and filtering large collections efficiently.

Sprint 4 will shift focus from library exploration to improving the playback experience and metadata editing workflow.
# Version 2 - Sprint 4

## Theme

Transform the Dashboard from a static placeholder into a functional home page for Dhvani.

---

## Objectives

- Build a meaningful Dashboard.
- Display information about the currently loaded library.
- Provide an overview of the music collection.
- Improve the application's first impression.

---

## Completed

### Dashboard Redesign

Replaced the original placeholder dashboard with a functional home page.

Added:

- Current Library section
- Library Overview cards
- Library Status section
- Quick Actions section

The Dashboard now serves as the landing page of the application.

---

### Current Library

The Dashboard now displays the currently loaded music library.

Information shown:

- Library name
- Full folder path

If no library is loaded, an appropriate message is displayed.

---

### Library Statistics

Created:

utils/calculateLibraryStats.ts

Implemented reusable calculations for:

- Total Songs
- Total Artists
- Total Albums
- Duplicate Groups
- Missing Artist Metadata
- Missing Album Metadata
- Total Library Duration

All statistics are calculated from the current library without requiring additional state.

---

### Duration Formatting

Added reusable helper:

formatDuration()

Displays library duration in a user-friendly format.

Example:

25h 4m

instead of raw seconds.

---

### Dashboard Components

Implemented responsive statistic cards.

Current overview includes:

- Songs
- Artists
- Albums
- Duplicate Groups

Added separate Library Status section displaying metadata completeness.

---

### UI Improvements

Improved visual hierarchy by introducing:

- Library information card
- Statistics cards
- Quick Action cards

The Dashboard now feels like a proper desktop application's home screen instead of a placeholder page.

---

## Architecture Improvements

Continued the Version 2 architecture philosophy.

Business logic remains outside React components.

Created reusable utility:

calculateLibraryStats()

DashboardPage is responsible only for presenting information.

---

## Lessons Learned

Not every planned feature remains the best solution as a project evolves.

The original Dashboard concept focused heavily on analytics.

During development it became clear that Dhvani benefits more from a lightweight home page summarizing the currently loaded library rather than acting as an analytics dashboard.

Updating the sprint goals to better match the application's evolution resulted in a cleaner and more practical design.

---

## Sprint Outcome

The Dashboard now provides users with immediate context about their current music library while avoiding duplication of functionality already available on the Library and Duplicates pages.

It serves as an effective home page for Dhvani Version 2.
----------
Version 2 - Sprint 5 Complete

Sprint Name: Duplicate Management Center

Objective

Transform the duplicate detection system from a simple scanner into a complete duplicate management workflow, allowing users to review, compare, select, and safely remove duplicate tracks from their music library.

Features Implemented
Duplicate Management Interface
Created a dedicated Duplicates page.
Displayed duplicate tracks grouped together for easier review.
Added duplicate group count and track count per group.
Track Information

Each duplicate entry now displays:

Title
Artist
Duration
Bitrate
File Size

Added helper utilities:

formatBitrate()
formatFileSize()
Intelligent Duplicate Selection

Implemented:

Individual checkbox selection
Select Duplicates
Automatically selects every duplicate while leaving the highest-quality copy unselected.
Select None

Selection is managed using:

Set<string>

for efficient lookup and updates.

Recommended Track System

Created reusable helper:

getRecommendedTrack()

Recommendation priority:

Highest bitrate
Largest file size (tie breaker)

The recommended track is highlighted with:

⭐ Recommended

This helper is now reusable for future cleanup features.

Duplicate Cleanup

Implemented two cleanup workflows.

Individual Cleanup

Each duplicate row includes:

Move to Recycle Bin

which:

asks for confirmation
moves the selected file to the system Recycle Bin
refreshes the music library
rescans duplicate groups
Bulk Cleanup

Implemented:

Delete Selected

Workflow:

confirmation dialog
deletes every selected duplicate
refreshes library once
rescans duplicates once
clears selection
displays completion message

This avoids repeated rescanning after every deleted file and greatly improves performance.

User Feedback

Added:

Selected track counter

Example:

5 tracks selected

Bulk delete button is automatically disabled when no tracks are selected.

Major Debugging Session

One of the biggest investigations of Version 2 occurred during this sprint.

Duplicate detection initially worked correctly on small test folders but failed on a large personal music library.

After tracing:

metadata extraction
scanner output
filename normalization
text similarity
duplicate grouping
scoring algorithm

the root cause was identified:

Many MP3 files contained no embedded metadata, causing the duplicate confidence score to never reach the original threshold.

The duplicate threshold was adjusted to better support real-world music collections while maintaining acceptable accuracy.

This debugging session significantly improved the reliability of duplicate detection across different libraries.

Architecture Improvements

Created reusable utility:

src/utils/getRecommendedTrack.ts

This removes duplicate recommendation logic from UI components and centralizes the decision process.

Future features can now reuse the same recommendation logic without duplication.

Sprint Outcome

Sprint 5 successfully transformed duplicate detection into a practical duplicate management tool.

Users can now:

detect duplicates
review duplicate groups
compare file quality
identify the recommended copy
select duplicates intelligently
delete individual duplicates
bulk delete duplicates safely
Sprint Status

Status: ✅ Completed

Looking Ahead

Version 2 now includes:

Music Library
Dashboard
Duplicate Management Center

With Sprint 5 complete, Version 2 is now feature-complete and ready for final testing, polishing, bug fixing, and release preparation before beginning work on Version 3.