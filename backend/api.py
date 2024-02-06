from fastapi import APIRouter, Query
from typing import List
from datetime import datetime

from models import Ticket
from database import Session

API = APIRouter()


@API.get("/")
def index():
    return {"status": "success"}


@API.get("/generate/{type}/{account}/")
def read_item(
    type: str,
    account: int,
    q: List[str] = Query(default=[]),
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
    cur_date = datetime.now().isoformat()

    if expiry <= 0:
        return False

    routes = []
    for i in range(len(q)-1):
        routes.append({"from": q[i], "to": q[i+1]})

    with Session() as session:
        obj = Ticket(account_id=account, expiry=expiry)
        session.add(obj)
        session.commit()

    return {
        "ticket": {
            "type": type,
            "user": name,
            "routes": routes,
        },
        "id": id,
        "account": account,
        "purchased": cur_date,
        "expiry": expiry,
    }


@API.get("/validate/{ref}")
def validate(ref: str):
    """
        Validate ticket by database query
    """

    return {"status": 401}