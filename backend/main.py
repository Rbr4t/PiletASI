import os

from fastapi import FastAPI

from api import API
from database import engine, Base


if not os.path.isfile("./../tickets.db"):
    Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(API, prefix='/api')
