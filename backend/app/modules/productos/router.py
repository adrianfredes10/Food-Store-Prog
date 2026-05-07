from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.core.database import get_session
from app.modules.productos.schemas import ProductoCreate, ProductoRead, ProductoUpdate
from app.modules.productos.service import ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["productos"])


def get_producto_service(session: Session = Depends(get_session)) -> ProductoService:
    return ProductoService(ProductoUnitOfWork(session))


@router.get("", response_model=list[ProductoRead])
def list_productos(
    service: ProductoService = Depends(get_producto_service),
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    nombre: Annotated[str | None, Query()] = None,
) -> list[ProductoRead]:
    return service.list_productos(offset, limit, nombre)


@router.post("", response_model=ProductoRead, status_code=201)
def create_producto(
    data: ProductoCreate,
    service: ProductoService = Depends(get_producto_service),
) -> ProductoRead:
    return service.create(data)


@router.get("/{producto_id}", response_model=ProductoRead)
def get_producto(
    producto_id: int,
    service: ProductoService = Depends(get_producto_service),
) -> ProductoRead:
    return service.get_by_id(producto_id)


@router.put("/{producto_id}", response_model=ProductoRead)
def update_producto(
    producto_id: int,
    data: ProductoUpdate,
    service: ProductoService = Depends(get_producto_service),
) -> ProductoRead:
    return service.update(producto_id, data)


@router.delete("/{producto_id}", status_code=204, response_model=None)
def delete_producto(
    producto_id: int,
    service: ProductoService = Depends(get_producto_service),
) -> None:
    service.delete(producto_id)
