"""Mete datos de ejemplo en la base (tenés que tener la DB accesible como cuando corrés la API)."""

from sqlmodel import Session

from app.core.database import engine, create_db_and_tables
from app.modules.categorias.models import Categoria
from app.modules.ingredientes.models import Ingrediente
from app.modules.productos.models import Producto, ProductoIngrediente


def seed() -> None:
    create_db_and_tables()
    with Session(engine) as session:
        if session.get(Categoria, 1) is not None:
            print("Ya hay datos (id=1). Saltando seed.")
            return

        cat = Categoria(nombre="Hamburguesas", descripcion="Artesanales")
        session.add(cat)
        session.commit()
        session.refresh(cat)

        ing1 = Ingrediente(nombre="Carne vacuna", unidad="g")
        ing2 = Ingrediente(nombre="Queso cheddar", unidad="g")
        session.add(ing1)
        session.add(ing2)
        session.commit()
        session.refresh(ing1)
        session.refresh(ing2)

        prod = Producto(
            categoria_id=cat.id,  # type: ignore[arg-type]
            nombre="Hamburguesa Clásica",
            descripcion="Carne y queso",
            precio=1500.0,
            stock=50,
            imagen_url=None,
        )
        session.add(prod)
        session.commit()
        session.refresh(prod)

        session.add(
            ProductoIngrediente(
                producto_id=prod.id,  # type: ignore[arg-type]
                ingrediente_id=ing1.id,  # type: ignore[arg-type]
                cantidad=200.0,
            )
        )
        session.add(
            ProductoIngrediente(
                producto_id=prod.id,  # type: ignore[arg-type]
                ingrediente_id=ing2.id,  # type: ignore[arg-type]
                cantidad=30.0,
            )
        )
        session.commit()
        print("Seed completado.")


if __name__ == "__main__":
    seed()
