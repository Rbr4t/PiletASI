from fastapi import APIRouter, HTTPException, Query
from typing import List, Union, Optional, Annotated
from datetime import datetime
from sqlalchemy import and_, or_, asc

from struktuurid import Marsruut, Peatus, Pilet, MarsruudidPeatused
from andmebaas import Session
from pydantic import BaseModel

API = APIRouter()


@API.get("/")
def index():
    return {"status": 200}


class PeatusStruktuur(BaseModel):
    id: int
    peatus: str
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

                onOlemas = session.query(Peatus).filter(
                    Peatus.peatus == sihtkoht.peatus).first()

                if not onOlemas:
                    peatus = Peatus(
                        peatus=sihtkoht.peatus
                    )
                    session.add(peatus)
                    session.commit()

                    marsruut_peatus = MarsruudidPeatused(
                        marsruut_id=marsruut.id, peatus_id=peatus.id, aeg=datetime.strptime(sihtkoht.timestamp, "%a, %d %b %Y %H:%M:%S %Z"))
                    session.add(marsruut_peatus)
                else:
                    marsruut_peatus = MarsruudidPeatused(
                        marsruut_id=marsruut.id, peatus_id=onOlemas.id, aeg=datetime.strptime(sihtkoht.timestamp, "%a, %d %b %Y %H:%M:%S %Z"))
                    session.add(marsruut_peatus)

                session.commit()

    return {"status": 200}


@API.get("/saa_parameetrid")
def parameetrid():
    with Session() as session:
        peatused = session.query(Peatus).all()
        marsruudid = session.query(Marsruut).all()

        return {"peatused": [x.peatus for x in peatused], "pilettypes": list(set([x.tüüp for x in marsruudid]))}


@API.get("/saa_marsruut/{id}")
def marsruut(id: int):

    with Session() as session:
        marsruut = session.query(Marsruut).filter(Marsruut.id == id).first()
        stops = []
        print(marsruut.peatused)
        try:
            for ids in marsruut.peatused:
                with Session() as session:
                    peatus = session.query(Peatus).filter(
                        Peatus.id == ids.peatus_id).first()
                    stop = session.query(MarsruudidPeatused).filter(
                        MarsruudidPeatused.peatus_id == ids.peatus_id).first()
                    stops.append({
                        "id": peatus.id,
                        "stop": peatus.peatus,
                        "timestamp": stop.aeg
                    })
        except:
            raise HTTPException(status_code=400, detail="andmebaas tühi")

        return {
            "transportType": marsruut.tüüp,
            "price": marsruut.hind,
            "stops": stops,
            "id": marsruut.id
        }


@API.get("/saa_marsruudid")
def marsruudid():
    result = []

    with Session() as session:
        marsruudid = session.query(Marsruut).all()
        for marsruut in marsruudid:
            stops = []

            for ids in marsruut.peatused:

                peatus = session.query(Peatus).filter(
                    Peatus.id == ids.peatus_id).first()
                stop = session.query(MarsruudidPeatused).filter(
                    MarsruudidPeatused.peatus_id == ids.peatus_id).first()
                stops.append({
                    "id": peatus.id,
                    "stop": peatus.peatus,
                    "timestamp": stop.aeg
                })

            result.append({
                "id": marsruut.id,
                "transportType": marsruut.tüüp,
                "price": marsruut.hind,
                "stops": stops
            })
    return result


def päri_marsruudid(tüüp, algus, sihtkoht, vahepeatused=[]):
    # TODO: fix this piece of shit
    result = []

    with Session() as session:

        peatus1 = session.query(Peatus).filter(
            Peatus.peatus == algus).first().id
        peatus2 = session.query(Peatus).filter(
            Peatus.peatus == sihtkoht).first().id
        if vahepeatused is not None:
            vahepeatused = [session.query(Peatus).filter(
                Peatus.peatus == x).first().id for x in vahepeatused]
        # print(peatus1, peatus2, vahepeatused)

        all_queries = []

        if vahepeatused is not None:
            routes = [[peatus1, vahepeatused[0]],
                      [vahepeatused[-1], peatus2]]
            for x in range(len(vahepeatused)-1):
                routes.insert(1, [vahepeatused[x], vahepeatused[x+1]])
        else:
            routes = [[peatus1, peatus2]]
        # print(routes)

        ids = set()
        for route in routes:
            start = route[0]
            end = route[1]

            query1 = session.query(MarsruudidPeatused).filter(
                MarsruudidPeatused.peatus_id == start).all()
            query2 = session.query(MarsruudidPeatused).filter(
                MarsruudidPeatused.peatus_id == end).all()
            query3 = [x.marsruut_id for x in query1] + \
                [x.marsruut_id for x in query2]
            # print(query3)
            s = set(filter(lambda x: query3.count(x) > 1, query3))
            for x in s:
                ids.add(x)
        query = session.query(MarsruudidPeatused).filter(
            MarsruudidPeatused.marsruut_id.in_(list(ids))).all()
        all_queries.append(query)

        # print(all_queries)
        marsruudid = {}

        for query in all_queries:
            for q in query:
                # print(q.id)

                if marsruudid.get(q.marsruut_id) is None:
                    marsruudid[q.marsruut_id] = [q.peatus_id]
                else:
                    marsruudid[q.marsruut_id] += [q.peatus_id]
        print(all_queries)

        sobivad_marsruudid = []

        # print(routes)
        for route in routes:

            start = route[0]
            end = route[1]
            # print(start, end)

            for marsruut_id, values in list(marsruudid.items()):
                if end in values and start in values and values.index(start) < values.index(end):
                    # print("SIIN: ")
                    # print(marsruut_id, values)
                    sobivad_marsruudid.append(marsruut_id)

        # print(sobivad_marsruudid)
        leitud_marsruudid = session.query(Marsruut).filter(
            Marsruut.id.in_(sobivad_marsruudid), Marsruut.tüüp == tüüp).all()

        for marsruut in leitud_marsruudid:
            stops = []

            for ids in marsruut.peatused:

                peatus = session.query(Peatus).filter(
                    Peatus.id == ids.peatus_id).first()
                stop = session.query(MarsruudidPeatused).filter(
                    MarsruudidPeatused.peatus_id == ids.peatus_id).first()
                stops.append({
                    "id": peatus.id,
                    "stop": peatus.peatus,
                    "timestamp": stop.aeg
                })

            result.append({
                "id": marsruut.id,
                "transportType": marsruut.tüüp,
                "price": marsruut.hind,
                "stops": stops
            })

    print(marsruudid)
    print(routes)

    print(sobivad_marsruudid)

    def custom_sort(item):
        return sobivad_marsruudid.index(item['id'])
    # raise HTTPException(status_code=400, detail="väljad vigased")
    print(result)
    return sorted(result, key=custom_sort)


@API.get("/leia_piletid/{tyyp}/{algus}/{sihtkoht}")
async def piletid(tyyp: str, algus: str, sihtkoht: str, q: List[str] = Query(None)):
    kõik_piletid = päri_marsruudid(tyyp, algus, sihtkoht, q)
    return {"marsruudid": kõik_piletid}


@API.get("/kustuta_marsruut/{id}")
def kustuta(id: int):
    try:
        with Session() as session:
            print(x.id for x in session.query(
                Marsruut).filter(Marsruut.id == id))
            session.query(Marsruut).filter(Marsruut.id == id).delete()
            session.query(MarsruudidPeatused).filter(
                MarsruudidPeatused.marsruut_id == id).delete(synchronize_session=False)
            session.commit()
    except:
        raise HTTPException(status_code=400, detail="selline kirje puudub")
    return {"status": 200}


@API.get("/valideeri/{id}")
def validate(id: int):
    # TODO: valideeri kasutaja andmebaasi päringuga

    with Session() as session:
        query = session.query(Pilet).filter(Pilet.id == id).first()
        print(query)
        if query:
            return {"status": 200}
        else:
            raise HTTPException(
                status_code=400, detail="selline kirje puudub")

    return {"status": 200}
