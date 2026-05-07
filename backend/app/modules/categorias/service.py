from fastapi import HTTPException

from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self._uow = uow

    def list_categorias(self, offset: int, limit: int) -> list[Categoria]:
        return self._uow.categorias.list_paginated(offset, limit)

    def get_by_id(self, categoria_id: int) -> Categoria:
        c = self._uow.categorias.get_by_id(categoria_id)
        if c is None:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return c

    def create(self, data: CategoriaCreate) -> Categoria:
        entity = Categoria(
            nombre=data.nombre,
            descripcion=data.descripcion,
        )
        created = self._uow.categorias.add(entity)
        self._uow.commit()
        return created

    def update(self, categoria_id: int, data: CategoriaUpdate) -> Categoria:
        c = self.get_by_id(categoria_id)
        if data.nombre is not None:
            c.nombre = data.nombre
        if data.descripcion is not None:
            c.descripcion = data.descripcion
        self._uow.session.add(c)
        self._uow.commit()
        self._uow.session.refresh(c)
        return c

    def delete(self, categoria_id: int) -> None:
        c = self.get_by_id(categoria_id)
        self._uow.categorias.delete(c)
        self._uow.commit()
