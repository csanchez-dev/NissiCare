from collections.abc import Sequence

from sqlalchemy import select

from app.core.repository import BaseRepository
from app.modules.consultations.models import Consultation

_NEWEST_FIRST = (Consultation.consulted_on.desc(), Consultation.id.desc())


class ConsultationRepository(BaseRepository[Consultation]):
    model = Consultation

    def list_for_patient(self, patient_id: int) -> Sequence[Consultation]:
        stmt = select(Consultation).where(Consultation.patient_id == patient_id).order_by(*_NEWEST_FIRST)
        return self.db.scalars(stmt).all()

    def recent(self, limit: int) -> Sequence[Consultation]:
        return self.db.scalars(select(Consultation).order_by(*_NEWEST_FIRST).limit(limit)).all()
