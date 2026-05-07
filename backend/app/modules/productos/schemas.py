from pydantic import BaseModel, ConfigDict, Field

from app.modules.categorias.schemas import CategoriaRead


class IngredienteInput(BaseModel):
    ingrediente_id: int
    cantidad: float = Field(gt=0)


class ProductoCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)
    precio: float = Field(gt=0)
    stock: int = Field(ge=0)
    imagen_url: str | None = None
    categoria_id: int
    ingredientes: list[IngredienteInput]


class ProductoUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)
    precio: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    imagen_url: str | None = None
    categoria_id: int | None = None
    ingredientes: list[IngredienteInput] | None = None


class IngredienteConCantidadRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    unidad: str
    cantidad: float


class ProductoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str | None
    precio: float
    stock: int
    imagen_url: str | None
    categoria: CategoriaRead
    ingredientes: list[IngredienteConCantidadRead]
