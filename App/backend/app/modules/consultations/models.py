from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.patients.models import Patient


class Consultation(Base):
    __tablename__ = "consultations"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id", ondelete="CASCADE"), index=True)
    consulted_on: Mapped[date] = mapped_column(default=date.today)
    reason: Mapped[str] = mapped_column(String(200))
    diagnosis: Mapped[str] = mapped_column(String(200), index=True)

    # Nota clínica SOAP
    subjective: Mapped[str] = mapped_column(Text, default="")
    objective: Mapped[str] = mapped_column(Text, default="")
    assessment: Mapped[str] = mapped_column(Text, default="")
    plan: Mapped[str] = mapped_column(Text, default="")

    # Signos vitales (todos opcionales)
    blood_pressure: Mapped[str | None] = mapped_column(String(10))
    heart_rate: Mapped[int | None]
    temperature: Mapped[float | None]
    oxygen_saturation: Mapped[int | None]
    weight: Mapped[float | None]

    patient: Mapped[Patient] = relationship(back_populates="consultations")
