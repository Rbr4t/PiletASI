from fastapi import APIRouter, HTTPException
from typing import List, Union
from datetime import datetime


from struktuurid import Marsruut, Peatus
from andmebaas import Session
from pydantic import BaseModel

API = APIRouter()


@API.get("/")
def index():
    return {"status": 200}


class PeatusStruktuur(BaseModel):
    id: int
    peatus: str
    aeg: str


class PiletRequest(BaseModel):
    tyyp: str
    hind: int
    peatused: List[PeatusStruktuur]


@API.post("/genereeri_marsruut")
async def read_item(pilet: PiletRequest):

    # TODO: tuvasta kasutaja

    if len(pilet.peatused) < 2:
        raise HTTPException(status_code=400, detail="liiga vähe peatusi")
    if any([x.aeg == "null" for x in pilet.peatused]):
        raise HTTPException(status_code=400, detail="kuupäevad puuduvad")

    sihtkohad = []
    print(pilet.peatused)
    for i in pilet.peatused:
        sihtkohad.append(i)

    # Loob marsruudi
    with Session() as session:
        marsruut = Marsruut(tüüp=pilet.tyyp, hind=pilet.hind)
        session.add(marsruut)
        session.commit()

        for sihtkoht in sihtkohad:
            print(sihtkoht)
            peatus = Peatus(marsruudi_id=marsruut.id,
                            peatus=sihtkoht.peatus, aeg=datetime.strptime(sihtkoht.aeg, "%a, %d %b %Y %H:%M:%S %Z"))
            session.add(peatus)
            session.commit()
    return {"status": 200}


@API.get("/validate/{ref}")
def validate(ref: str):

    # TODO: valideeri kasutaja andmebaasi päringuga

    return {"status": 401}
