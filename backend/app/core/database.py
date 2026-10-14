from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base común de todos los modelos ORM."""


def get_db() -> Iterator[Session]:
    """Una sesión por petición (inyectada con Depends)."""
    with SessionLocal() as db:
        yield db


def init_db() -> None:
    """Registra los modelos de cada módulo y crea las tablas.
    En producción, reemplazar por migraciones (Alembic)."""
    from app.modules.consultations import models as _consultations  # noqa: F401
    from app.modules.patients import models as _patients  # noqa: F401

    Base.metadata.create_all(engine)
