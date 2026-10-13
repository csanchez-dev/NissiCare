from collections.abc import Sequence

from sqlalchemy import func, or_, select
from sqlalchemy.orm import selectinload

from app.core.repository import BaseRepository
from app.modules.consultations.models import Consultation
from app.modules.patients.models import Patient
from app.modules.patients.schemas import PatientFilter

_FILTERS = {
    "allergies": func.cardinality(Patient.allergies) > 0,
    "chronic": func.cardinality(Patient.conditions) > 0,
}


class PatientRepository(BaseRepository[Patient]):
    model = Patient

    def search(self, query: str, filter_by: PatientFilter) -> Sequence[Patient]:
        stmt = select(Patient).options(selectinload(Patient.consultations)).order_by(Patient.full_name)
        if query:
            like = f"%{query}%"
            stmt = stmt.where(
                or_(
                    Patient.full_name.ilike(like),
                    Patient.document.ilike(like),
                    Patient.consultations.any(Consultation.diagnosis.ilike(like)),
                )
            )
        if filter_by in _FILTERS:
            stmt = stmt.where(_FILTERS[filter_by])
        return self.db.scalars(stmt).all()

    def get_by_document(self, document: str) -> Patient | None:
        return self.db.scalar(select(Patient).where(Patient.document == document))
