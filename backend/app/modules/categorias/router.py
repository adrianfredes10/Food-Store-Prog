from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.core.database import get_session
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaService
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["categorias"])


def get_categoria_service(session: Session = Depends(get_session)) -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork(session))


@router.get("", response_model=list[CategoriaRead])
def list_categorias(
    service: CategoriaService = Depends(get_categoria_service),
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
) -> list[CategoriaRead]:
    items = service.list_categorias(offset, limit)
    return [CategoriaRead.model_validate(x) for x in items]


@router.post("", response_model=CategoriaRead, status_code=201)
def create_categoria(
    data: CategoriaCreate,
    service: CategoriaService = Depends(get_categoria_service),
) -> CategoriaRead:
    created = service.create(data)
    return CategoriaRead.model_validate(created)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def get_categoria(
    categoria_id: int,
    service: CategoriaService = Depends(get_categoria_service),
) -> CategoriaRead:
    c = service.get_by_id(categoria_id)
    return CategoriaRead.model_validate(c)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def update_categoria(
    categoria_id: int,
    data: CategoriaUpdate,
    service: CategoriaService = Depends(get_categoria_service),
) -> CategoriaRead:
    updated = service.update(categoria_id, data)
    return CategoriaRead.model_validate(updated)


@router.delete("/{categoria_id}", status_code=204, response_model=None)
def delete_categoria(
    categoria_id: int,
    service: CategoriaService = Depends(get_categoria_service),
) -> None:
    service.delete(categoria_id)
