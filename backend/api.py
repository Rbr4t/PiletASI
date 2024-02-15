from fastapi import APIRouter, HTTPException
from typing import List, Union, Optional
from datetime import datetime
from sqlalchemy import and_

from struktuurid import Marsruut, Peatus, Pilet
from andmebaas import Session
from pydantic import BaseModel

API = APIRouter()


@API.get("/")
def index():
    return {"status": 200}


class PeatusStruktuur(BaseModel):
    id: int
    stop: str
    timestamp: str


class PiletRequest(BaseModel):
    transportType: str
    price: int
    stops: List[PeatusStruktuur]


# genereerib ja kustutab vajadusel marsruute
# TODO: kasutada PUT http route-i marsruutide muutmiseks
@API.post("/genereeri_marsruut")
async def read_item(pilet: PiletRequest):
    print(pilet)
    # TODO: tuvasta kasutaja

    if len(pilet.stops) < 2:
        raise HTTPException(status_code=400, detail="liiga vähe peatusi")
    if any([x.timestamp == "null" for x in pilet.stops]):
        raise HTTPException(status_code=400, detail="kuupäevad puuduvad")

    sihtkohad = []
    print(pilet.stops)
    for i in pilet.stops:
        sihtkohad.append(i)

    try:
        with Session() as session:
            marsruut = session.query(Marsruut).filter(
                Marsruut.id == pilet.id).first().delete()
    except:
        # Loob marsruudi
        with Session() as session:
            marsruut = Marsruut(tüüp=pilet.transportType, hind=pilet.price)
            session.add(marsruut)
            session.commit()

            for sihtkoht in sihtkohad:
                print(sihtkoht)
                peatus = Peatus(marsruudi_id=marsruut.id,
                                peatus=sihtkoht.stop,
                                aeg=datetime.strptime(sihtkoht.timestamp, "%a, %d %b %Y %H:%M:%S %Z"))
                session.add(peatus)
                session.commit()

    return {"status": 200}


@API.get("/saa_marsruut/{id}")
def marsruut(id: int):

    with Session() as session:
        marsruut = session.query(Marsruut).filter(Marsruut.id == id).first()
        stops = []
        print(marsruut.peatused)
        try:
            for peatus in marsruut.peatused:
                print(peatus.peatus)
                stops.append({
                    "id": peatus.id,
                    "stop": peatus.peatus,
                    "timestamp": peatus.aeg
                })
        except:
            raise HTTPException(status_code=400, detail="andmebaas tühi")

        return {
            "transportType": marsruut.tüüp,
            "price": marsruut.hind,
            "stops": stops
        }


@API.get("/saa_marsruudid")
def marsruudid():
    result = []

    with Session() as session:
        marsruudid = session.query(Marsruut).all()
        for marsruut in marsruudid:
            stops = []
            for peatus in marsruut.peatused:
                stops.append({
                    "id": peatus.id,
                    "stop": peatus.peatus,
                    "timestamp": peatus.aeg
                })

            result.append({
                "id": marsruut.id,
                "transportType": marsruut.tüüp,
                "price": marsruut.hind,
                "stops": stops
            })
    return result


def päri_marsruudid(tüüp, algus, sihtkoht):
    with Session() as session:
        query = session.query(Marsruut)
        # TODO: vahepeatuste arvestamine

        query = query.filter(
            and_(Marsruut.peatused.any(Peatus.peatus == algus), Marsruut.peatused.any(Peatus.peatus == sihtkoht)))

        return query.all()


@API.get("/leia_piletid/{tyyp}/{algus}/{sihtkoht}")
def piletid(tyyp: str, algus: str, sihtkoht: str):
    print(tyyp)
    kõik_piletid = päri_marsruudid(tyyp, algus, sihtkoht)
    print("here")
    return {"marsruudid": kõik_piletid}


@API.get("/kustuta_marsruut/{id}")
def kustuta(id: int):
    try:
        with Session() as session:
            print(x.id for x in session.query(
                Marsruut).filter(Marsruut.id == id))
            session.query(Marsruut).filter(Marsruut.id == id).delete()
            session.commit()
    except:
        raise HTTPException(status_code=400, detail="selline kirje puudub")
    return {"status": 200}


@API.get("/valideeri/{ref}")
def validate(ref: str):
    # TODO: valideeri kasutaja andmebaasi päringuga

    try:
        with Session() as session:
            query = session.query(Pilet).filter(Pilet.id == id).first()
            return {"status": 200}
    except:
        raise HTTPException(status_code=400, detail="selline kirje puudub")
