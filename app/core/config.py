import os
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv(
    "TMDB_BASE_URL",
    "https://api.themoviedb.org/3",
)
TMDB_IMAGE_BASE = os.getenv(
    "TMDB_IMAGE_BASE",
    "https://image.tmdb.org/t/p/w500",
)

if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY is not set")
