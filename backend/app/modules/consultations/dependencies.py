from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.consultations.repository import ConsultationRepository
from app.modules.consultations.service import ConsultationService
from app.modules.patients.repository import PatientRepository
from app.modules.patients.service import PatientService


def get_consultation_service(db: Session = Depends(get_db)) -> ConsultationService:
    return ConsultationService(ConsultationRepository(db), PatientService(PatientRepository(db)))


ConsultationServiceDep = Annotated[ConsultationService, Depends(get_consultation_service)]
