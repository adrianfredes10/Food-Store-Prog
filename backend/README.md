# FoodStore — Backend

FastAPI + SQLModel + PostgreSQL. Ver `../openspec/project.md` y `../openspec/openspec.md`.

## Arranque

1. Copiá `.env.example` a `.env` y ajustá `DATABASE_URL`.
2. Creá la base `foodstore` en PostgreSQL.
3. `py -3 -m venv .venv` → activá el venv → `pip install -r requirements.txt`
4. `python -m fastapi dev main.py` (o `uvicorn main:app --reload`)

Datos de prueba: `python seed.py` (con el venv activado y la DB accesible).
