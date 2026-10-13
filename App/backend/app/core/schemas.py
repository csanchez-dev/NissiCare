from typing import TypeVar

from pydantic import BaseModel, ConfigDict, create_model
from pydantic.alias_generators import to_camel
from pydantic.fields import FieldInfo


class CamelModel(BaseModel):
    """JSON en camelCase hacia fuera, snake_case en Python."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


T = TypeVar("T", bound=BaseModel)


def as_partial(model: type[T], name: str) -> type[CamelModel]:
    """Deriva un esquema de actualización (PATCH) con todos los campos opcionales (DRY)."""
    fields = {
        key: (info.annotation | None, FieldInfo.merge_field_infos(info, default=None, default_factory=None))
        for key, info in model.model_fields.items()
    }
    return create_model(name, __base__=CamelModel, **fields)
