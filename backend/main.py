import os

from fastapi import FastAPI

from api import API
from andmebaas import engine, Base


if not os.path.isfile("./../tickets.db"):
    Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def read_root():
    return {"status": 200}


app.include_router(API, prefix='/api')
