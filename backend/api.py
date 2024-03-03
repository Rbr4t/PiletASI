from fastapi import APIRouter, HTTPException, Query
from typing import List
from datetime import datetime

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

# TODO: tuvasta kasutaja

@API.post("/genereeri_marsruut")
async def read_item(pilet: PiletRequest):
    print(pilet)

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
        # print(all_queries)

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

        print(leitud_marsruudid)

        dfs_data = {}

        for marsruut in leitud_marsruudid:
            stops_ids = []

            for ids in marsruut.peatused:
                stop = session.query(MarsruudidPeatused).filter(
                    MarsruudidPeatused.peatus_id == ids.peatus_id).first()
                stops_ids += [stop.peatus_id]

            dfs_data[marsruut.id] = stops_ids

    print(f"Marsruudid: {dfs_data}")

    graph = {}
    for i in dfs_data.keys():
        for j in range(len(dfs_data[i])):
            for l in range(j + 1, len(dfs_data[i])):
                for (a, b) in ((j, l), (l, j)):
                    a = dfs_data[i][a]
                    b = dfs_data[i][b]
                    if a in graph:
                        if b in graph[a].keys():
                            graph[a][b].append(i)
                        else:
                            graph[a][b] = [i]
                    else:
                        graph[a] = {b: [i]}

    def DFS(graph, tee, path=[], current=0):
        answers = []
        if current == len(tee) - 1:
            return [path]
        curr_node = tee[current]
        next_node = tee[current + 1]
        if curr_node not in graph:
            return []
        if next_node not in graph[curr_node]:
            return []
        for i in graph[curr_node][next_node]:
            if i not in path:
                new_path = path.copy()
                new_path.append(i)
                answers.extend(DFS(graph, tee, new_path, current + 1))
        return answers

    new_routes = []
    for el in routes:
        for e in el:
            if e not in new_routes:
                new_routes.append(e)
    print(f"Teekond: {new_routes}")
    sobivad_marsruudid = DFS(graph, new_routes)
    print(sobivad_marsruudid)

    result = []
    for marsruut in sobivad_marsruudid:
        marsruut_vahe = []
        for marsruut_id in marsruut:
            stops = []
            reaalne_marsruut = session.query(Marsruut).filter(
                Marsruut.id == marsruut_id).first()

            for ids in reaalne_marsruut.peatused:

                peatus = session.query(Peatus).filter(
                    Peatus.id == ids.peatus_id).first()
                stop = session.query(MarsruudidPeatused).filter(
                    MarsruudidPeatused.peatus_id == ids.peatus_id).first()
                stops.append({
                    "id": peatus.id,
                    "stop": peatus.peatus,
                    "timestamp": stop.aeg
                })

            marsruut_vahe.append({
                "id": reaalne_marsruut.id,
                "transportType": reaalne_marsruut.tüüp,
                "price": reaalne_marsruut.hind,
                "stops": stops
            })
        result.append(marsruut_vahe)

    print(f"Result: {result}")

    # TODO: Valideeri ajad (kuupv ja kellaaeg)

    return result


@API.get("/leia_piletid/{tyyp}/{algus}/{sihtkoht}")
async def piletid(tyyp: str, algus: str, sihtkoht: str, q: List[str] = Query(None)):
    kõik_piletid = päri_marsruudid(tyyp, algus, sihtkoht, q)
    return {"marsruudid": kõik_piletid}


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
