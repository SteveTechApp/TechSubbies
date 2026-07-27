<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YybwIyYTK7ZoYAEVujEk_tBvqixA1CCF

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.local.example` to `.env.local` and set `VITE_API_BASE_URL`
3. Copy `backend/.env.example` to `backend/.env`; keep secrets such as `GEMINI_API_KEY` on the backend only
4. Run the backend from `backend/` with `npm start`
5. Run the frontend:
   `npm run dev`

Production frontend builds must set `VITE_API_BASE_URL` to an HTTPS backend URL
or a same-origin path such as `/api`. The build fails rather than silently
connecting customers to `localhost`.

Deployment probes:

- `GET /api/health/live` confirms the backend process is running.
- `GET /api/health/ready` confirms the backend can query its database.
- `GET /api/health` remains a backwards-compatible readiness alias.

Every backend response includes `X-Request-Id`. Production request logs contain
only correlation metadata (method, path, status and duration), never request
bodies or authorization headers. Unexpected errors return the request ID so
support can locate the matching server event without exposing stack traces.

## Database deployment

The backend enables SQLite WAL mode, normal synchronous durability, foreign-key
checks and a five-second busy timeout. The database file and its `-wal`/`-shm`
companions must live on persistent local storage and be backed up together.

Run only one backend instance against a SQLite database file. Horizontal scaling
or multi-region deployment requires migrating the repository layer to a managed
database such as PostgreSQL rather than sharing SQLite over a network filesystem.

## Compliance and certification model

TechSubbies includes a role-specific compliance taxonomy for safety, AV industry credentials, IT/networking certifications, manufacturer training, project management credentials, insurance, company standards and background checks.

The compliance model is defined in:

- `types/compliance.ts`
- `data/compliance.ts`
- `services/complianceEngine.ts`
- `views/ComplianceStandardsPage.tsx`
- `docs/TECHSUBBIES_COMPLIANCE_CERTIFICATION_MODEL.md`

Basic access stays open. Certificates increase trust and match confidence. Certificates become mandatory only when the project, site, customer, country or role genuinely requires them.
