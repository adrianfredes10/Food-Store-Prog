from fastapi import HTTPException

from app.modules.categorias.schemas import CategoriaRead
from app.modules.ingredientes.models import Ingrediente
from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    IngredienteConCantidadRead,
    IngredienteInput,
    ProductoCreate,
    ProductoRead,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self._uow = uow

    def _ensure_categoria(self, categoria_id: int) -> None:
        c = self._uow.categorias.get_by_id(categoria_id)
        if c is None:
            raise HTTPException(
                status_code=404,
                detail=f"Categoría con id {categoria_id} no encontrada",
            )

    def _ensure_ingredientes(self, items: list[IngredienteInput]) -> None:
        for item in items:
            ing = self._uow.ingredientes.get_by_id(item.ingrediente_id)
            if ing is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Ingrediente con id {item.ingrediente_id} no encontrado",
                )

    def _to_read(
        self,
        producto: Producto,
        ing_rows: list[tuple[Ingrediente, float]],
    ) -> ProductoRead:
        if producto.categoria is None:
            raise HTTPException(
                status_code=500,
                detail="Inconsistencia: categoría no cargada para el producto",
            )
        pid = producto.id
        if pid is None:
            raise HTTPException(status_code=500, detail="Producto sin id")
        return ProductoRead(
            id=pid,
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio=producto.precio,
            stock=producto.stock,
            imagen_url=producto.imagen_url,
            categoria=CategoriaRead.model_validate(producto.categoria),
            ingredientes=[
                IngredienteConCantidadRead(
                    id=ing.id,  # type: ignore[arg-type]
                    nombre=ing.nombre,
                    unidad=ing.unidad,
                    cantidad=qty,
                )
                for ing, qty in ing_rows
            ],
        )

    def list_productos(
        self,
        offset: int,
        limit: int,
        nombre: str | None,
    ) -> list[ProductoRead]:
        productos = self._uow.productos.list_with_categoria(offset, limit, nombre)
        ids = [p.id for p in productos if p.id is not None]
        ing_map = self._uow.productos.ingredientes_con_cantidad_por_productos(ids)
        return [
            self._to_read(p, ing_map.get(p.id, []))
            for p in productos
            if p.id is not None
        ]

    def get_by_id(self, producto_id: int) -> ProductoRead:
        p = self._uow.productos.get_by_id_with_categoria(producto_id)
        if p is None:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        assert p.id is not None
        ing_map = self._uow.productos.ingredientes_con_cantidad_por_productos([p.id])
        return self._to_read(p, ing_map.get(p.id, []))

    def create(self, data: ProductoCreate) -> ProductoRead:
        self._ensure_categoria(data.categoria_id)
        self._ensure_ingredientes(data.ingredientes)
        entity = Producto(
            categoria_id=data.categoria_id,
            nombre=data.nombre,
            descripcion=data.descripcion,
            precio=data.precio,
            stock=data.stock,
            imagen_url=data.imagen_url,
        )
        created = self._uow.productos.add(entity)
        self._uow.session.flush()
        assert created.id is not None
        rows = [(i.ingrediente_id, i.cantidad) for i in data.ingredientes]
        self._uow.productos.add_ingredient_links(created.id, rows)
        self._uow.commit()
        return self.get_by_id(created.id)

    def update(self, producto_id: int, data: ProductoUpdate) -> ProductoRead:
        p = self._uow.productos.get_by_id_with_categoria(producto_id)
        if p is None:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        if data.nombre is not None:
            p.nombre = data.nombre
        if data.descripcion is not None:
            p.descripcion = data.descripcion
        if data.precio is not None:
            p.precio = data.precio
        if data.stock is not None:
            p.stock = data.stock
        if data.imagen_url is not None:
            p.imagen_url = data.imagen_url
        if data.categoria_id is not None:
            self._ensure_categoria(data.categoria_id)
            p.categoria_id = data.categoria_id
        if data.ingredientes is not None:
            self._ensure_ingredientes(data.ingredientes)
            assert p.id is not None
            self._uow.productos.delete_links_for_producto(p.id)
            self._uow.productos.add_ingredient_links(
                p.id,
                [(i.ingrediente_id, i.cantidad) for i in data.ingredientes],
            )
        self._uow.session.add(p)
        self._uow.commit()
        self._uow.session.refresh(p)
        return self.get_by_id(producto_id)

    def delete(self, producto_id: int) -> None:
        p = self._uow.productos.get_by_id(producto_id)
        if p is None:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        assert p.id is not None
        self._uow.productos.delete_links_for_producto(p.id)
        self._uow.productos.delete(p)
        self._uow.commit()
