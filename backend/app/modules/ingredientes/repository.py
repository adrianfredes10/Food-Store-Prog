from sqlmodel import Session, col, select

from app.core.repository import BaseRepository
from app.modules.ingredientes.models import Ingrediente


class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Ingrediente)

    def get_by_nombre(self, nombre: str) -> Ingrediente | None:
        stmt = select(Ingrediente).where(col(Ingrediente.nombre) == nombre)
        return self.session.exec(stmt).first()
