from sqlmodel import Field, Relationship, SQLModel

from app.modules.productos.models import Producto, ProductoIngrediente


class Ingrediente(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100, unique=True)
    unidad: str = Field(min_length=1, max_length=10)

    productos: list[Producto] = Relationship(
        back_populates="ingredientes",
        link_model=ProductoIngrediente,
    )
