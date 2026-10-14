from fastapi import APIRouter, Query, Response, status

from app.modules.consultations.dependencies import ConsultationServiceDep
from app.modules.consultations.schemas import ConsultationCreate, ConsultationRead, ConsultationUpdate

router = APIRouter(tags=["consultations"])


@router.get("/patients/{patient_id}/consultations", response_model=list[ConsultationRead])
def list_patient_consultations(patient_id: int, service: ConsultationServiceDep):
    return service.list_for_patient(patient_id)


@router.post(
    "/patients/{patient_id}/consultations", response_model=ConsultationRead, status_code=status.HTTP_201_CREATED
)
def create_consultation(patient_id: int, data: ConsultationCreate, service: ConsultationServiceDep):
    return service.create(patient_id, data)


@router.get("/consultations", response_model=list[ConsultationRead])
def recent_consultations(service: ConsultationServiceDep, limit: int = Query(5, ge=1, le=50)):
    return service.recent(limit)


@router.get("/consultations/{consultation_id}", response_model=ConsultationRead)
def get_consultation(consultation_id: int, service: ConsultationServiceDep):
    return service.get(consultation_id)


@router.patch("/consultations/{consultation_id}", response_model=ConsultationRead)
def update_consultation(consultation_id: int, data: ConsultationUpdate, service: ConsultationServiceDep):
    return service.update(consultation_id, data)


@router.delete("/consultations/{consultation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_consultation(consultation_id: int, service: ConsultationServiceDep):
    service.delete(consultation_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
