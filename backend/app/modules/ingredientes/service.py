from fastapi import HTTPException

from app.modules.ingredientes.models import Ingrediente
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteUpdate
from app.modules.ingredientes.unit_of_work import IngredienteUnitOfWork


class IngredienteService:
    def __init__(self, uow: IngredienteUnitOfWork) -> None:
        self._uow = uow

    def list_ingredientes(self, offset: int, limit: int) -> list[Ingrediente]:
        return self._uow.ingredientes.list_paginated(offset, limit)

    def get_by_id(self, ingrediente_id: int) -> Ingrediente:
        ing = self._uow.ingredientes.get_by_id(ingrediente_id)
        if ing is None:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        return ing

    def create(self, data: IngredienteCreate) -> Ingrediente:
        existing = self._uow.ingredientes.get_by_nombre(data.nombre)
        if existing is not None:
            raise HTTPException(
                status_code=409,
                detail="Ya existe un ingrediente con ese nombre",
            )
        entity = Ingrediente(nombre=data.nombre, unidad=data.unidad)
        created = self._uow.ingredientes.add(entity)
        self._uow.commit()
        return created

    def update(self, ingrediente_id: int, data: IngredienteUpdate) -> Ingrediente:
        ing = self.get_by_id(ingrediente_id)
        if data.nombre is not None:
            other = self._uow.ingredientes.get_by_nombre(data.nombre)
            if other is not None and other.id != ingrediente_id:
                raise HTTPException(
                    status_code=409,
                    detail="Ya existe un ingrediente con ese nombre",
                )
            ing.nombre = data.nombre
        if data.unidad is not None:
            ing.unidad = data.unidad
        self._uow.session.add(ing)
        self._uow.commit()
        self._uow.session.refresh(ing)
        return ing

    def delete(self, ingrediente_id: int) -> None:
        ing = self.get_by_id(ingrediente_id)
        self._uow.ingredientes.delete(ing)
        self._uow.commit()
