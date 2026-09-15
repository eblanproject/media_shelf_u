from fastapi import FastAPI
from app.routes.movies import router as movies_router


app = FastAPI(
    title="MediaShelf API",
    description="Movie and TV catalog API",
    version="1.0.0",
)


app.include_router(movies_router)


@app.get("/")
def root():
    return {
        "message": "MediaShelf API",
        "status": "ok",
    }
