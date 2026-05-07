from collections import defaultdict

from sqlalchemy.orm import selectinload
from sqlmodel import Session, col, select

from app.core.repository import BaseRepository
from app.modules.ingredientes.models import Ingrediente
from app.modules.productos.models import Producto, ProductoIngrediente


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_by_id_with_categoria(self, producto_id: int) -> Producto | None:
        stmt = (
            select(Producto)
            .where(Producto.id == producto_id)
            .options(selectinload(Producto.categoria))
        )
        return self.session.exec(stmt).first()

    def list_with_categoria(
        self,
        offset: int,
        limit: int,
        nombre: str | None,
    ) -> list[Producto]:
        stmt = select(Producto).options(selectinload(Producto.categoria))
        if nombre:
            stmt = stmt.where(col(Producto.nombre).ilike(f"%{nombre}%"))
        stmt = stmt.offset(offset).limit(limit)
        return list(self.session.exec(stmt).all())

    def ingredientes_con_cantidad_por_productos(
        self,
        producto_ids: list[int],
    ) -> dict[int, list[tuple[Ingrediente, float]]]:
        if not producto_ids:
            return {}
        stmt = (
            select(ProductoIngrediente, Ingrediente)
            .join(Ingrediente, Ingrediente.id == ProductoIngrediente.ingrediente_id)
            .where(col(ProductoIngrediente.producto_id).in_(producto_ids))
        )
        result: dict[int, list[tuple[Ingrediente, float]]] = defaultdict(list)
        for link, ing in self.session.exec(stmt).all():
            result[link.producto_id].append((ing, link.cantidad))
        return dict(result)

    def delete_links_for_producto(self, producto_id: int) -> None:
        stmt = select(ProductoIngrediente).where(
            ProductoIngrediente.producto_id == producto_id
        )
        for link in self.session.exec(stmt).all():
            self.session.delete(link)

    def add_ingredient_links(
        self,
        producto_id: int,
        rows: list[tuple[int, float]],
    ) -> None:
        for ing_id, cantidad in rows:
            self.session.add(
                ProductoIngrediente(
                    producto_id=producto_id,
                    ingrediente_id=ing_id,
                    cantidad=cantidad,
                )
            )
