from datetime import date

from pydantic import Field

from app.core.schemas import CamelModel, as_partial


class ConsultationCreate(CamelModel):
    consulted_on: date = Field(default_factory=date.today)
    reason: str = Field(min_length=2, max_length=200)
    diagnosis: str = Field(min_length=2, max_length=200)
    subjective: str = ""
    objective: str = ""
    assessment: str = ""
    plan: str = ""
    blood_pressure: str | None = Field(default=None, pattern=r"^\d{2,3}/\d{2,3}$")
    heart_rate: int | None = Field(default=None, ge=20, le=250)
    temperature: float | None = Field(default=None, ge=30, le=45)
    oxygen_saturation: int | None = Field(default=None, ge=50, le=100)
    weight: float | None = Field(default=None, gt=0)


ConsultationUpdate = as_partial(ConsultationCreate, "ConsultationUpdate")


class ConsultationRead(ConsultationCreate):
    id: int
    patient_id: int
