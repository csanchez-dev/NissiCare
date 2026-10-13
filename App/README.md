# NisssiCare

Historia clínica digital: **React + TypeScript** (frontend) · **FastAPI** (API REST) · **PostgreSQL**.

## Arranque rápido

```bash
# 1. Base de datos + API (http://localhost:8000/docs)
docker compose up --build

# 2. Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev
```

Sin Docker: levanta tu propio PostgreSQL, copia `backend/.env.example` a `backend/.env`, y ejecuta
`pip install -r requirements.txt && uvicorn app.main:app --reload` dentro de `backend/`.
Las tablas se crean al iniciar la API.

## Arquitectura

```
backend/app
├── core/                  # transversal: config, database, errors, schemas, BaseRepository
├── modules/
│   ├── patients/          # models · schemas · repository · service · dependencies · router
│   └── consultations/     # misma estructura; depende de PatientService, no de sus tablas
├── api.py                 # ensambla los routers
└── main.py                # app, CORS, manejo de errores

frontend/src
├── shared/                # httpClient, componentes UI, utilidades, hooks genéricos
├── features/
│   ├── patients/          # types · api · hooks · components
│   ├── consultations/     # types · api · hooks · components
│   └── dashboard/
├── layout/                # Header
└── App.tsx · main.tsx
```

### Patrones y principios aplicados
| Principio / patrón | Dónde |
|---|---|
| Capas (Router → Service → Repository) | cada módulo del backend; el servicio no conoce HTTP ni SQL |
| Repository genérico (DRY) | `core/repository.py`: add/get/update/delete reutilizados por todos los módulos |
| Inyección de dependencias | `dependencies.py` con `Depends` |
| Esquemas derivados (DRY) | `as_partial()` genera los esquemas PATCH desde los de creación |
| Errores de dominio | `DomainError` → respuesta HTTP en un solo manejador |
| Adapter / Gateway | `httpClient.ts` + `api.ts` por feature: la UI nunca usa `fetch` |
| Custom hooks (Facade) | `hooks.ts` por feature encapsula React Query |
| Registro de pestañas (Open/Closed) | `patients/components/tabs.tsx`: nueva pestaña = nueva fila |
| Componentes reutilizables | `Modal`, `Field`, `Tag`, `ClinicalListCard` (alergias, antecedentes y medicación comparten componente) |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/patients?q=&filter=all\|allergies\|chronic` | Buscar por nombre, documento o diagnóstico |
| POST | `/api/patients` | Crear paciente |
| GET / PATCH / DELETE | `/api/patients/{id}` | Leer, actualizar parcialmente, eliminar |
| GET / POST | `/api/patients/{id}/consultations` | Consultas del paciente / nueva consulta |
| GET | `/api/consultations?limit=5` | Consultas recientes |
| GET / PATCH / DELETE | `/api/consultations/{id}` | Leer, actualizar parcialmente, eliminar |

Documentación interactiva en `http://localhost:8000/docs`.

## Antes de producción
Autenticación y roles (JWT), auditoría de accesos, cifrado y cumplimiento de la normativa de datos de salud (RGPD en España), migraciones con Alembic y tests automatizados.
