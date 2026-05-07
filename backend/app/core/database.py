from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings


def _sqlalchemy_database_url(url: str) -> str:
    """Pasa la URL a postgresql+psycopg (driver v3). En el .env podés dejar postgresql://… y acá lo arreglamos."""
    if url.startswith("postgresql+psycopg://"):
        return url
    if url.startswith("postgresql://"):
        return "postgresql+psycopg://" + url.removeprefix("postgresql://")
    return url


settings = get_settings()
engine = create_engine(_sqlalchemy_database_url(settings.database_url), echo=False)


def create_db_and_tables() -> None:
    # Importamos modelos aca para que SQLModel se entere de las tablas antes del create_all
    from app.modules.categorias import models as _categorias_models  # noqa: F401
    from app.modules.ingredientes import models as _ingredientes_models  # noqa: F401
    from app.modules.productos import models as _productos_models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
