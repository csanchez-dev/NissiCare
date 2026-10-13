from collections.abc import Sequence

from app.core.errors import NotFoundError
from app.modules.consultations.models import Consultation
from app.modules.consultations.repository import ConsultationRepository
from app.modules.consultations.schemas import ConsultationCreate, ConsultationUpdate
from app.modules.patients.service import PatientService


class ConsultationService:
    """Depende de PatientService (no de sus tablas) para validar que el paciente existe."""

    def __init__(self, repo: ConsultationRepository, patients: PatientService) -> None:
        self.repo = repo
        self.patients = patients

    def list_for_patient(self, patient_id: int) -> Sequence[Consultation]:
        self.patients.get(patient_id)
        return self.repo.list_for_patient(patient_id)

    def recent(self, limit: int) -> Sequence[Consultation]:
        return self.repo.recent(limit)

    def get(self, consultation_id: int) -> Consultation:
        consultation = self.repo.get(consultation_id)
        if consultation is None:
            raise NotFoundError("Consulta no encontrada")
        return consultation

    def create(self, patient_id: int, data: ConsultationCreate) -> Consultation:
        self.patients.get(patient_id)
        return self.repo.add(Consultation(patient_id=patient_id, **data.model_dump()))

    def update(self, consultation_id: int, data: ConsultationUpdate) -> Consultation:
        return self.repo.update(self.get(consultation_id), data.model_dump(exclude_unset=True))

    def delete(self, consultation_id: int) -> None:
        self.repo.delete(self.get(consultation_id))
