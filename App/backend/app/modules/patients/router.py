from fastapi import APIRouter, Query, Response, status

from app.modules.patients.dependencies import PatientServiceDep
from app.modules.patients.schemas import PatientCreate, PatientFilter, PatientRead, PatientUpdate

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=list[PatientRead])
def list_patients(service: PatientServiceDep, q: str = "", filter_by: PatientFilter = Query("all", alias="filter")):
    return service.list(q, filter_by)


@router.post("", response_model=PatientRead, status_code=status.HTTP_201_CREATED)
def create_patient(data: PatientCreate, service: PatientServiceDep):
    return service.create(data)


@router.get("/{patient_id}", response_model=PatientRead)
def get_patient(patient_id: int, service: PatientServiceDep):
    return service.get(patient_id)


@router.patch("/{patient_id}", response_model=PatientRead)
def update_patient(patient_id: int, data: PatientUpdate, service: PatientServiceDep):
    return service.update(patient_id, data)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, service: PatientServiceDep):
    service.delete(patient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
