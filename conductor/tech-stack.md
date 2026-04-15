# Technology Stack

## Languages
- **JavaScript/TypeScript:** Used for the frontend application.
- **Python:** Used for the backend server.

## Frontend
- **React.js:** Component-based library for building the complex UI and managing client-side state.

## Backend
- **Python (FastAPI) with WebSockets:** A modern, fast web framework for building APIs with Python, utilizing WebSockets for real-time bi-directional communication necessary for the planning poker lobby.

## Infrastructure & Deployment
- **Docker:** Used for containerizing the application into a single, unified image.
- **Nginx:** Used as a high-performance web server to serve the React frontend and act as a reverse proxy for the FastAPI backend.
- **GitHub Actions:** Used for continuous integration to automatically run tests on push and pull requests to the main branch.

## Database
- **None / In-Memory:** The application will rely on in-memory data structures within the FastAPI server to manage active lobbies and user votes, keeping the application fast and lightweight.