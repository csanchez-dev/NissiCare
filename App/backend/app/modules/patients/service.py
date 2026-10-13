from collections.abc import Sequence

from app.core.errors import ConflictError, NotFoundError
from app.modules.patients.models import Patient
from app.modules.patients.repository import PatientRepository
from app.modules.patients.schemas import PatientCreate, PatientFilter, PatientUpdate


class PatientService:
    """Reglas de negocio de pacientes. No conoce HTTP ni SQL."""

    def __init__(self, repo: PatientRepository) -> None:
        self.repo = repo

    def list(self, query: str, filter_by: PatientFilter) -> Sequence[Patient]:
        return self.repo.search(query.strip(), filter_by)

    def get(self, patient_id: int) -> Patient:
        patient = self.repo.get(patient_id)
        if patient is None:
            raise NotFoundError("Paciente no encontrado")
        return patient

    def create(self, data: PatientCreate) -> Patient:
        self._ensure_unique_document(data.document)
        return self.repo.add(Patient(**data.model_dump()))

    def update(self, patient_id: int, data: PatientUpdate) -> Patient:
        patient = self.get(patient_id)
        changes = data.model_dump(exclude_unset=True)
        if changes.get("document") not in (None, patient.document):
            self._ensure_unique_document(changes["document"])
        return self.repo.update(patient, changes)

    def delete(self, patient_id: int) -> None:
        self.repo.delete(self.get(patient_id))

    def _ensure_unique_document(self, document: str) -> None:
        if self.repo.get_by_document(document):
            raise ConflictError("Ya existe un paciente con ese documento")
