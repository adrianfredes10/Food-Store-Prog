from sqlmodel import Session

from app.core.unit_of_work import BaseUnitOfWork
from app.modules.ingredientes.repository import IngredienteRepository


class IngredienteUnitOfWork(BaseUnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.ingredientes = IngredienteRepository(session)
