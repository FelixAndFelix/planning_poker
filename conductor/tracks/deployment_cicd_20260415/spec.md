# Track Specification: Application Deployment and CI/CD Pipeline

## Overview
This track focuses on making the Planning Poker application ready for deployment by containerizing it and establishing a continuous integration pipeline. The goal is to create a single, unified Docker image containing both the React frontend (served via Nginx) and the FastAPI backend, and to set up GitHub Actions to automatically run tests on key repository events.

## Functional Requirements
- **Containerization:** Create a single `Dockerfile` at the root of the project.
- **Unified Image:** The single Docker container must run both the built React frontend and the FastAPI backend.
- **Frontend Serving:** Use Nginx within the container to serve the static frontend assets.
- **Port Configuration:** The application must be accessible externally on port `2323`. This port will route traffic appropriately to the frontend and backend.
- **Networking Documentation:** Document the port configurations and internal routing (e.g., Nginx reverse proxying to FastAPI) clearly.
- **CI/CD Pipeline (GitHub Actions):** Create a GitHub Actions workflow to run the test suite automatically.
- **CI Triggers:** The GitHub Action must trigger on:
  - Commits to the `main` branch.
  - Pull Requests targeting the `main` branch.

## Non-Functional Requirements
- The Docker image should be optimized for size (e.g., using multi-stage builds).
- Clear documentation on how to build and run the Docker container must be provided in the project's README.

## Acceptance Criteria
- [ ] A `Dockerfile` exists in the project root.
- [ ] Running `docker build -t planning-poker .` successfully creates an image.
- [ ] Running `docker run -p 2323:80 planning-poker` starts both Nginx and FastAPI.
- [ ] The web application is fully accessible and functional in a browser via `http://localhost:2323`.
- [ ] Nginx is correctly configured to serve the frontend and proxy API/WebSocket requests to the backend.
- [ ] A `.github/workflows/ci.yml` file exists and is configured to run automated tests.
- [ ] The GitHub Actions workflow successfully executes tests on commits and PRs to `main`.
- [ ] Deployment and port configurations are documented.

## Out of Scope
- Automated deployment to a production environment (Continuous Deployment).
- Setting up external databases (using in-memory state as defined in the tech stack).