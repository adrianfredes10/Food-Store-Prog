import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    database_url: str

    def __init__(self) -> None:
        self.database_url = os.environ.get(
            "DATABASE_URL",
            "postgresql://postgres:password@localhost:5432/foodstore",
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
