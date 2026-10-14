from datetime import date
from typing import Literal

from pydantic import Field

from app.core.schemas import CamelModel, as_partial

PatientFilter = Literal["all", "allergies", "chronic"]


class PatientCreate(CamelModel):
    full_name: str = Field(min_length=2, max_length=150)
    document: str = Field(min_length=3, max_length=40)
    birth_date: date
    sex: Literal["F", "M"]
    phone: str | None = Field(default=None, max_length=40)
    blood_type: str | None = Field(default=None, max_length=5)
    allergies: list[str] = []
    conditions: list[str] = []
    medications: list[str] = []


PatientUpdate = as_partial(PatientCreate, "PatientUpdate")


class PatientRead(PatientCreate):
    id: int
    last_diagnosis: str | None = None
