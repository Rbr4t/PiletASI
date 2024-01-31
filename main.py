from datetime import datetime
from fastapi import FastAPI, Query
from random import randint
from typing import Annotated, List, Dict

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

    id = randint(0, 1000000)
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    code = letters[randint(0, 25)] + \
        letters[randint(0, 25)] + letters[randint(0, 25)]

    # check if the ticket is already in the db

    # check if this type of ticket is in the database

    if expiry <= 0:
        return False

    routes = []
    for i in range(len(q)-1):
        routes.append({"from": q[i], "to": q[i+1]})

    return {
        "ticket": {
            "id": type[0].upper() + '-' + code + f"{id:06}",
            "type": type,
            "user": name,
            "routes": routes,
            "barcode": "||| | ||  |"
        },
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
