from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.patients.repository import PatientRepository
from app.modules.patients.service import PatientService


def get_patient_service(db: Session = Depends(get_db)) -> PatientService:
    return PatientService(PatientRepository(db))


PatientServiceDep = Annotated[PatientService, Depends(get_patient_service)]
