# NisssiCare

**A modern electronic health record (EHR) prototype built for speed: create a patient history in seconds and find any patient's data in a couple of keystrokes.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-MVP-orange)

> ⚠️ **This is an MVP/prototype. It has no authentication yet.** Use fictional data only. Do not store real patient information until login, roles, audit logging and data-protection compliance (GDPR/HIPAA, depending on your region) are in place.

---

## Features

- **Instant patient search** by name, ID document or diagnosis, with quick filters (all, with allergies, chronic conditions).
- **Safety-first patient view**: allergies appear in a red alert at the top of every record.
- **SOAP consultations**: structured notes (Subjective, Objective, Assessment, Plan) plus diagnosis and vital signs, saved to a chronological timeline.
- **Vital-sign trends**: blood pressure, heart rate, weight and oxygen saturation charted across visits.
- **Editable clinical lists**: allergies, medical history and current medication.
- **Full CRUD** for patients and consultations.
- **Responsive and accessible**: works on desktop and mobile, keyboard-friendly, light and dark themes.
- **Clinical design language**: calm teal and mint palette, with red reserved for alerts only.

<!-- Add screenshots here:
![Dashboard](docs/dashboard.png)
![Patient record](docs/patient.png)
-->

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript (strict), Vite, TanStack Query |
| Backend | FastAPI, Pydantic v2, SQLAlchemy 2 |
| Database | PostgreSQL 16 (psycopg 3) |
| Tooling | Docker Compose |

## Architecture

The project is a monorepo with a modular backend and a feature-based frontend.

```
nisssicare/
├── backend/app/
│   ├── core/                 # config, database, errors, base schemas, generic repository
│   ├── modules/
│   │   ├── patients/         # models · schemas · repository · service · dependencies · router
│   │   └── consultations/    # same structure; depends on PatientService, not its tables
│   ├── api.py                # assembles routers
│   └── main.py               # app, CORS, error handling
├── frontend/src/
│   ├── shared/               # http client, UI components, hooks, utilities
│   ├── features/
│   │   ├── patients/         # types · api · hooks · components
│   │   ├── consultations/    # types · api · hooks · components
│   │   └── dashboard/
│   ├── layout/
│   ├── App.tsx
│   └── main.tsx
└── docker-compose.yml
```

### Design principles and patterns

| Principle / pattern | Where |
|---|---|
| Layered architecture (Router → Service → Repository) | Every backend module; services know nothing about HTTP or SQL |
| Generic repository (DRY) | `core/repository.py` provides add/get/update/delete to all modules |
| Dependency injection | `dependencies.py` with FastAPI `Depends` |
| Derived schemas (DRY) | `as_partial()` builds PATCH schemas from the create schemas |
| Domain errors | `DomainError` subclasses mapped to HTTP responses in one handler |
| Adapter / gateway | `httpClient.ts` + per-feature `api.ts`; UI code never calls `fetch` |
| Custom hooks as a facade | Per-feature `hooks.ts` wraps TanStack Query |
| Open/Closed tab registry | `patients/components/tabs.tsx`: a new tab is one new row |
| Reusable components | `Modal`, `Field`, `Tag`, `ClinicalListCard` (shared by allergies, history and medication) |

## Getting started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+

### 1. Start the database and API

```bash
docker compose up --build
```

The API runs at <http://localhost:8000> and the interactive docs at <http://localhost:8000/docs>. Tables are created automatically on startup.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. In development, Vite proxies `/api` to the backend.

### Running without Docker

```bash
# Backend
cd backend
cp .env.example .env            # edit DATABASE_URL to point at your PostgreSQL
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Configuration

| Variable | Where | Description | Default |
|---|---|---|---|
| `DATABASE_URL` | backend | SQLAlchemy URL; must use the `postgresql+psycopg://` scheme | `postgresql+psycopg://nisssi:nisssi@localhost:5432/nisssicare` |
| `CORS_ORIGINS` | backend | JSON list of allowed frontend origins | `["http://localhost:5173"]` |
| `VITE_API_URL` | frontend | API base URL, read **at build time** | `/api` |

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/patients?q=&filter=all\|allergies\|chronic` | Search patients by name, document or diagnosis |
| `POST` | `/api/patients` | Create a patient |
| `GET` `PATCH` `DELETE` | `/api/patients/{id}` | Read, partially update, delete |
| `GET` `POST` | `/api/patients/{id}/consultations` | List a patient's consultations / add one |
| `GET` | `/api/consultations?limit=5` | Most recent consultations |
| `GET` `PATCH` `DELETE` | `/api/consultations/{id}` | Read, partially update, delete |
| `GET` | `/health` | Health check |

Request and response bodies use `camelCase` JSON. Full schemas are available at `/docs`.

## Deploying a free demo

NisssiCare can run entirely on free tiers (limits change, so check each provider's pricing page):

| Piece | Service | Notes |
|---|---|---|
| Frontend | [Netlify](https://www.netlify.com) | Base directory `frontend`, build `npm run build`, publish `dist`, env var `VITE_API_URL` |
| API | [Render](https://render.com) | Root `backend`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`; free instances sleep after inactivity |
| Database | [Neon](https://neon.com) | Use the connection string with the `postgresql+psycopg://` prefix |

After the first deploy, set `CORS_ORIGINS` on the API to your Netlify URL.

## Roadmap

- [ ] Authentication (JWT) and roles (doctor, admin)
- [ ] Edit consultations from the UI (the API already supports it)
- [ ] Appointment scheduling
- [ ] Printable prescriptions and medical reports
- [ ] File attachments (lab results, imaging)
- [ ] ICD-10 diagnosis search
- [ ] Audit log of record access
- [ ] Database migrations with Alembic
- [ ] Automated tests (pytest, Vitest, Playwright)

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.

## Disclaimer

NisssiCare is an educational prototype and is not a certified medical device or a compliant clinical system. It must not be used for real patient care or real patient data in its current state.

## License

Add a license of your choice (for example MIT) in a `LICENSE` file.
