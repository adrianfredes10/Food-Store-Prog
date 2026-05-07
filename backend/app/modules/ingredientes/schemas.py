from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

UnidadMedida = Literal["g", "kg", "ml", "l", "u"]


class IngredienteCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(min_length=2, max_length=100)
    unidad: UnidadMedida


class IngredienteUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    unidad: UnidadMedida | None = None


class IngredienteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    unidad: str
