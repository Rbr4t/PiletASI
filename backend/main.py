import os

from datetime import datetime
from fastapi import FastAPI, Query
from typing import List
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/generate/{type}/{account}/")
def read_item(
    type: str,
    account: str,
    q: List[str] = Query(),
    expiry: int = 30,
    name: str = ''
):
    """
        Ticket type (String)
        Ticket purchace date
        Ticket ID (generate randomly)
        and custom expiry(or not)
    """
    # check if the user is authenticated

    # check if the ticket is already in the db

    # check if this type of ticket is in the database

    # query last ticket id and add 1
    id = 0 + 1

    if expiry <= 0:
        return False

    routes = []
    for i in range(len(q)-1):
        routes.append({"from": q[i], "to": q[i+1]})

    return {
        "ticket": {
            "type": type,
            "user": name,
            "routes": routes,
            "barcode": "||| | ||  |"
        },
        "id": id,
        "account": account,
        "purchased": datetime.now().isoformat(),
        "expiry": expiry,
    }


@app.get("/validate/{ref}")
def validate(ref: str):
    """
        Validate ticket by database query
    """

    return {"status": 401}


SQLALCHEMY_DATABASE_URL = "sqlite:///../tickets.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
if not os.path.isfile("./../tickets.db"):
    Base.metadata.create_all(engine)
