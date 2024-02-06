from fastapi import APIRouter, Query
from typing import List
from datetime import datetime

from struktuurid import Pilet
from andmebaas import Session

API = APIRouter()


@API.get("/")
def index():
    return {"status": 200}


@API.get("/genereeri/{tyyp}/{kasutaja}/")
def read_item(
    tyyp: str,
    kasutaja: int,
    q: List[str] = Query(default=[]),
    kestev: int = 30,
    nimi: str = ''
):

    # TODO: tuvasta kasutaja

    id = 0 + 1
    prg_kuupv = datetime.now().isoformat()

    if kestev <= 0:
        return False

    sihtkohad = []
    for i in range(len(q)-1):
        sihtkohad.append({"algus": q[i], "lõpp": q[i+1]})

    with Session() as session:
        obj = Pilet(kasutaja_id=kasutaja, kestev=kestev)
        session.add(obj)
        session.commit()

    return {
        "ticket": {
            "type": tyyp,
            "user": nimi,
            "routes": sihtkohad,
        },
        "id": id,
        "account": kasutaja,
        "purchased": prg_kuupv,
        "expiry": kestev,
    }


@API.get("/validate/{ref}")
def validate(ref: str):

    # TODO: valideeri kasutaja andmebaasi päringuga

    return {"status": 401}
