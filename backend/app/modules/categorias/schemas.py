from pydantic import BaseModel, ConfigDict, Field


class CategoriaCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(min_length=2, max_length=50)
    descripcion: str | None = Field(default=None, max_length=200)


class CategoriaUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str | None = Field(default=None, min_length=2, max_length=50)
    descripcion: str | None = Field(default=None, max_length=200)


class CategoriaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str | None
