from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=50, unique=True)
    descripcion: str | None = Field(default=None, max_length=200)

    productos: list["Producto"] = Relationship(back_populates="categoria")
