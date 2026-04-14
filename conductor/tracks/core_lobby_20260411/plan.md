# Implementation Plan: core_lobby_20260411

## Phase 1: Project Setup and Backend Foundation [checkpoint: 8b8ce80]
- [x] Task: Initialize FastAPI project structure and testing framework [577d3ad]
    - [x] Write Tests: Setup pytest and basic server health check test
    - [x] Implement Feature: Create basic FastAPI app and health endpoint
- [x] Task: Implement Session Management (In-Memory) [24ea290]
    - [x] Write Tests: Test session creation, joining, and state tracking
    - [x] Implement Feature: Create SessionManager class to hold active lobbies and users
- [x] Task: Implement WebSocket Endpoint [8ba0557]
    - [x] Write Tests: Test WebSocket connection and message broadcasting
    - [x] Implement Feature: Create `/ws/{session_id}/{user_id}` endpoint for real-time communication
- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Setup and Backend Foundation' (Protocol in workflow.md) [8b8ce80]

## Phase 2: Frontend Foundation and Lobby System [checkpoint: 5d006e9]
- [x] Task: Initialize React project structure and testing framework [142f5f1]
    - [x] Write Tests: Setup Jest/React Testing Library and render initial component
    - [x] Implement Feature: Initialize React app with basic layout and routing
- [x] Task: Implement Lobby Join UI [cdbc249]
    - [x] Write Tests: Test name input form and join button interactions
    - [x] Implement Feature: Create Join Component that accepts a display name and connects to the WebSocket
- [x] Task: Conductor - User Manual Verification 'Phase 2: Frontend Foundation and Lobby System' (Protocol in workflow.md) [5d006e9]

## Phase 3: Voting System and Game Logic
- [x] Task: Implement Fibonacci Card Deck UI [e16524b]
    - [x] Write Tests: Test rendering of Fibonacci cards (0, 1, 2, 3, 5, 8, 13, 21, Skip) and selection state
    - [x] Implement Feature: Create Card Deck component for participants to cast their vote
- [x] Task: Implement WebSocket Voting Logic [aa7ba7a]
    - [x] Write Tests: Test `vote` event emission from client and handling on server
    - [x] Implement Feature: Send vote to server, update session state, and broadcast updated state to all clients
- [ ] Task: Implement Reveal and Average Calculation
    - [ ] Write Tests: Test average calculation ignoring skipped votes, test `reveal` event broadcasting
    - [ ] Implement Feature: Host button to reveal votes, compute average, and display results to all participants
- [ ] Task: Implement Reset Round Logic
    - [ ] Write Tests: Test `reset` event to clear votes and start a new round
    - [ ] Implement Feature: Add reset functionality for the host
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Voting System and Game Logic' (Protocol in workflow.md)