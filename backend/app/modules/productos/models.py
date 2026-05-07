from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.modules.categorias.models import Categoria

if TYPE_CHECKING:
    from app.modules.ingredientes.models import Ingrediente


class ProductoIngrediente(SQLModel, table=True):
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)
    cantidad: float = Field(gt=0)


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id")
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)
    precio: float = Field(gt=0)
    stock: int = Field(ge=0)
    imagen_url: str | None = Field(default=None)

    categoria: Categoria = Relationship(back_populates="productos")
    ingredientes: list["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=ProductoIngrediente,
    )
