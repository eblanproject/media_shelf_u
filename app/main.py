from fastapi import FastAPI
from app.routes.movies import router as movies_router
from app.routes.tv import router as tv_router
from app.routes.search import router as search_router


app = FastAPI(
    title="MediaShelf API",
    description="Movie and TV catalog API",
    version="1.0.0",
)


app.include_router(movies_router)
app.include_router(tv_router)
app.include_router(search_router)


@app.get("/")
def root():
    return {
        "message": "MediaShelf API",
        "status": "ok",
    }
