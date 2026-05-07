from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.core.database import get_session
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.modules.ingredientes.service import IngredienteService
from app.modules.ingredientes.unit_of_work import IngredienteUnitOfWork

router = APIRouter(prefix="/ingredientes", tags=["ingredientes"])


def get_ingrediente_service(session: Session = Depends(get_session)) -> IngredienteService:
    return IngredienteService(IngredienteUnitOfWork(session))


@router.get("", response_model=list[IngredienteRead])
def list_ingredientes(
    service: IngredienteService = Depends(get_ingrediente_service),
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
) -> list[IngredienteRead]:
    items = service.list_ingredientes(offset, limit)
    return [IngredienteRead.model_validate(x) for x in items]


@router.post("", response_model=IngredienteRead, status_code=201)
def create_ingrediente(
    data: IngredienteCreate,
    service: IngredienteService = Depends(get_ingrediente_service),
) -> IngredienteRead:
    created = service.create(data)
    return IngredienteRead.model_validate(created)


@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def get_ingrediente(
    ingrediente_id: int,
    service: IngredienteService = Depends(get_ingrediente_service),
) -> IngredienteRead:
    ing = service.get_by_id(ingrediente_id)
    return IngredienteRead.model_validate(ing)


@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def update_ingrediente(
    ingrediente_id: int,
    data: IngredienteUpdate,
    service: IngredienteService = Depends(get_ingrediente_service),
) -> IngredienteRead:
    updated = service.update(ingrediente_id, data)
    return IngredienteRead.model_validate(updated)


@router.delete("/{ingrediente_id}", status_code=204, response_model=None)
def delete_ingrediente(
    ingrediente_id: int,
    service: IngredienteService = Depends(get_ingrediente_service),
) -> None:
    service.delete(ingrediente_id)
