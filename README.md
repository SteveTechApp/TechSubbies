# TechSubbies

TechSubbies is a two-sided technical marketplace for companies, resourcing businesses, and engineers. The current product foundation covers canonical role/capability profiles, persisted opportunities and applications, explainable shortlisting, contracts, timesheets, membership billing, documents, and completion validation.

## Repository layout

- `views/`, `components/`, `context/`, `services/`, `types/`: React/Vite application.
- `backend/src/`: Express API, SQLite persistence, domain policy, and membership billing.
- `cypress/e2e/`: persisted browser journeys.
- `docs/ARCHITECTURE.md`: dependency boundaries and structural conventions.
- `docs/DEVELOPMENT_PLAN.md`: phased delivery plan and exit criteria.

## Local setup

Requirements: Node.js 22.5 or newer.

```powershell
npm ci
npm ci --prefix backend
Copy-Item .env.local.example .env.local
Copy-Item backend/.env.example backend/.env
```

Start the API and frontend in separate terminals:

```powershell
npm run dev --prefix backend
npm run dev
```

The frontend defaults to `http://localhost:5173`; the API defaults to `http://localhost:4000/api`.

## Validation

```powershell
npm run check
npm run e2e
```

`check` runs frontend typechecking, unit tests and build, followed by backend tests and build. The E2E command creates an isolated SQLite database and runs the marketplace golden path through Cypress.

## Deployment

Dockerfiles are provided for the frontend and backend, with local orchestration in `docker-compose.yml`. Configure secrets outside source control. Use `/api/health` for liveness and `/api/ready` for database readiness.

Before any production launch, complete the production-data-store, billing reconciliation, audit, backup/restore, and observability exit criteria in the development plan.
