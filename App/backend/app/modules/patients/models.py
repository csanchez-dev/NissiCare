from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.consultations.models import Consultation


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(150), index=True)
    document: Mapped[str] = mapped_column(String(40), unique=True)
    birth_date: Mapped[date]
    sex: Mapped[str] = mapped_column(String(1))
    phone: Mapped[str | None] = mapped_column(String(40))
    blood_type: Mapped[str | None] = mapped_column(String(5))
    allergies: Mapped[list[str]] = mapped_column(JSON, default=list)
    conditions: Mapped[list[str]] = mapped_column(JSON, default=list)
    medications: Mapped[list[str]] = mapped_column(JSON, default=list)

    consultations: Mapped[list[Consultation]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
        order_by="[Consultation.consulted_on.desc(), Consultation.id.desc()]",
    )

    @property
    def last_diagnosis(self) -> str | None:
        return self.consultations[0].diagnosis if self.consultations else None
