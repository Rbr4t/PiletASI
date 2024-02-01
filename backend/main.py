import os

from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from api import API


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(API, prefix='/api')

SQLALCHEMY_DATABASE_URL = "sqlite:///../tickets.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
if not os.path.isfile("./../tickets.db"):
    Base.metadata.create_all(engine)
