from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.core.database import create_db_and_tables
from app.modules.categorias.router import router as categorias_router
from app.modules.health.router import router as health_router
from app.modules.ingredientes.router import router as ingredientes_router
from app.modules.productos.router import router as productos_router

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        create_db_and_tables()
    except OperationalError as exc:
        logger.warning(
            "PostgreSQL no disponible al iniciar (revisá DATABASE_URL en .env: "
            "usuario, contraseña y que exista la base foodstore). "
            "La API sigue arriba; /health responde, el resto fallará hasta conectar. "
            "Detalle: %s",
            exc,
        )
    yield


app = FastAPI(title="FoodStore API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(categorias_router)
app.include_router(ingredientes_router)
app.include_router(productos_router)
