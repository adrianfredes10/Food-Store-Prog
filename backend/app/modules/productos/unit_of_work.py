from sqlmodel import Session

from app.core.unit_of_work import BaseUnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from app.modules.ingredientes.repository import IngredienteRepository
from app.modules.productos.repository import ProductoRepository


class ProductoUnitOfWork(BaseUnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.productos = ProductoRepository(session)
        self.categorias = CategoriaRepository(session)
        self.ingredientes = IngredienteRepository(session)
