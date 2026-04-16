# Implementation Plan: Frontend Redesign with Stitch

## Phase 1: Preparation & Design Sync [checkpoint: 0d41469]
- [x] Task: Synchronize Stitch Design and Setup Environment f1ad447
    - [x] Analyze Stitch project `projects/16760718228231401515` (Planing Poker) to understand the design tokens and layout.
    - [x] Create a new frontend structure to replace `frontend/src`.
    - [x] Install any necessary dependencies for the new design system (e.g., specific fonts, icons).
- [x] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Design Sync' (Protocol in workflow.md) 0d41469

## Phase 2: Lobby Screen Implementation (TDD) [checkpoint: 4088da7]
- [x] Task: Implement Lobby Screen UI and Validation 713ddb2
    - [x] Write tests for Lobby component (empty fields validation, join trigger).
    - [x] Create `Join.tsx` using Stitch-inspired components and DHBW styling.
    - [x] Implement validation logic and error messages.
- [x] Task: Connect Lobby to Backend a163529
    - [x] Write tests for WebSocket connection and session creation/join.
    - [x] Integrate WebSocket logic to handle Lobby actions.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Lobby Screen Implementation' (Protocol in workflow.md) 4088da7

## Phase 3: Game Screen & Voting (TDD)
- [ ] Task: Implement Game Screen UI & Participants List
    - [ ] Write tests for Game screen layout and participant rendering.
    - [ ] Create `Game.tsx` using Stitch-inspired components.
    - [ ] Implement real-time participant list updates.
- [ ] Task: Implement Voting Deck and Actions
    - [ ] Write tests for card selection and vote submission.
    - [ ] Create `CardDeck.tsx` with Fibonacci + Special cards.
    - [ ] Implement Reveal and Reset functionality.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Game Screen & Voting' (Protocol in workflow.md)

## Phase 4: Results, Polish & Final Integration
- [ ] Task: Implement Results and Average Calculation
    - [ ] Write tests for average calculation (ignoring 'Skip'/'?').
    - [ ] Create `Results` section within Game component.
- [ ] Task: Final UI Polish & Responsiveness
    - [ ] Verify mobile responsiveness on iPhone-like viewports.
    - [ ] Conduct final cleanup and removal of old frontend code.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Results, Polish & Final Integration' (Protocol in workflow.md)
