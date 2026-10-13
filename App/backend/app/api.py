from fastapi import APIRouter

from app.modules.consultations.router import router as consultations_router
from app.modules.patients.router import router as patients_router

api_router = APIRouter()
api_router.include_router(patients_router)
api_router.include_router(consultations_router)
