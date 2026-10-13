from typing import Any, Generic, TypeVar

from sqlalchemy.orm import Session

from app.core.database import Base

T = TypeVar("T", bound=Base)


class BaseRepository(Generic[T]):
    """CRUD genérico. Cada módulo lo extiende solo con sus consultas propias."""

    model: type[T]

    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, entity_id: int) -> T | None:
        return self.db.get(self.model, entity_id)

    def add(self, entity: T) -> T:
        self.db.add(entity)
        return self._commit(entity)

    def update(self, entity: T, changes: dict[str, Any]) -> T:
        for field, value in changes.items():
            setattr(entity, field, value)
        return self._commit(entity)

    def delete(self, entity: T) -> None:
        self.db.delete(entity)
        self.db.commit()

    def _commit(self, entity: T) -> T:
        self.db.commit()
        self.db.refresh(entity)
        return entity
