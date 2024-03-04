from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Optional
from datetime import datetime

from struktuurid import Marsruut, Peatus, Pilet, MarsruudidPeatused, PiletiPeatused
from andmebaas import Session
from pydantic import BaseModel

from login import get_current_user
from emailer import saada_email

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


def is_authorized(token):
    return get_current_user(token)


@API.post("/genereeri_marsruut")
async def read_item(request: Request, pilet: PiletRequest):
    print(pilet)
    token = request.headers.get('authorization').split(" ")[1]

    if not is_authorized(token):
        raise HTTPException(status_code=403, detail="Puudub ligipääs")

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
def kustuta(request: Request, id: int):
    token = request.headers.get('authorization').split(" ")[1]

    if not is_authorized(token):
        raise HTTPException(status_code=403, detail="Puudub ligipääs")

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

# TODO: fix route editing in frontend and maybe it can work


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
    print(result)
    return result


@API.post("/lisa_uus_pilet")
async def uusPilet(request: Request):
    pilet = await request.json()

    print(pilet)  # Print the received data to inspect it
    with Session() as session:
        if pilet["kasutaja_id"] != "":

            uus_pilet = Pilet(kasutaja_id=int(
                pilet["kasutaja_id"]), kasutatud=False)
        else:
            uus_pilet = Pilet(kasutaja_id=None, kasutatud=False)

        session.add(uus_pilet)
        session.commit()
        print(pilet["transport"])
        for marsruut in pilet["transport"]:
            uus_marsruut = PiletiPeatused(
                pilet_id=uus_pilet.id, marsruut_id=marsruut["id"])
            session.add(uus_marsruut)
        session.commit()

        peatus_väljumine_pairs = []

        # Iterate over each transport item
        for transport_item in pilet['transport']:
            # Iterate over each stops item within the transport item
            for stop_item in transport_item['stops']:
                # Extract stop name and timestamp
                peatus = stop_item['stop']
                väljumine = stop_item['timestamp']
                # Append to the list
                peatus_väljumine_pairs.append(
                    {'peatus': peatus, 'väljumine': väljumine})
        saada_email(
            pilet["email"], pilet["vahepeatused"][0], pilet["vahepeatused"][-1],
            uus_pilet.id, pilet["name"], pilet["departure"], pilet["arrival"], pilet["transportType"], peatus_väljumine_pairs)
    return {"data": pilet}


def päri_marsruudid(tüüp, algus, sihtkoht, vahepeatused=[]):
    if vahepeatused is not None:
        vahepeatused_algsed = vahepeatused.copy()
    else:
        vahepeatused_algsed = []
    with Session() as session:

        try:
            peatus1 = session.query(Peatus).filter(
                Peatus.peatus == algus).first().id
        except:
            raise HTTPException(status_code=400, detail="Algus-peatus puudub")
        try:
            peatus2 = session.query(Peatus).filter(
                Peatus.peatus == sihtkoht).first().id
        except:
            raise HTTPException(status_code=400, detail="Lõpp-peatus puudub")
        try:
            if vahepeatused is not None:
                vahepeatused = [session.query(Peatus).filter(
                    Peatus.peatus == x).first().id for x in vahepeatused]
        except:
            raise HTTPException(
                status_code=400, detail="Vahepeatused puudub/puuduvad")

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
                MarsruudidPeatused.peatus_id == start, MarsruudidPeatused.aeg > datetime.now()).all()
            query2 = session.query(MarsruudidPeatused).filter(
                MarsruudidPeatused.peatus_id == end, MarsruudidPeatused.aeg > datetime.now()).all()
            query3 = [x.marsruut_id for x in query1] + \
                [x.marsruut_id for x in query2]
            s = set(filter(lambda x: query3.count(x) > 1, query3))
            for x in s:
                ids.add(x)
        query = session.query(MarsruudidPeatused).filter(
            MarsruudidPeatused.marsruut_id.in_(list(ids))).all()
        all_queries.append(query)

        marsruudid = {}

        for query in all_queries:
            for q in query:

                if marsruudid.get(q.marsruut_id) is None:
                    marsruudid[q.marsruut_id] = [q.peatus_id]
                else:
                    marsruudid[q.marsruut_id] += [q.peatus_id]

        sobivad_marsruudid = []

        for route in routes:

            start = route[0]
            end = route[1]

            for marsruut_id, values in list(marsruudid.items()):
                if end in values and start in values and values.index(start) < values.index(end):
                    sobivad_marsruudid.append(marsruut_id)

        if tüüp == "null":
            leitud_marsruudid = session.query(Marsruut).filter(
                Marsruut.id.in_(sobivad_marsruudid)).all()
        else:
            leitud_marsruudid = session.query(Marsruut).filter(
                Marsruut.id.in_(sobivad_marsruudid), Marsruut.tüüp == tüüp).all()

        dfs_data = {}

        for marsruut in leitud_marsruudid:
            stops_ids = []

            for ids in marsruut.peatused:
                stop = session.query(MarsruudidPeatused).filter(
                    MarsruudidPeatused.peatus_id == ids.peatus_id).first()
                stops_ids += [stop.peatus_id]

            dfs_data[marsruut.id] = stops_ids

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
    sobivad_marsruudid = DFS(graph, new_routes)

    result = []

    for marsruut in sobivad_marsruudid:
        marsruut_vahe = []
        marsruudid_tüübid = set()
        hind_kokku = 0

        for marsruut_id in marsruut:
            stops = []
            reaalne_marsruut = session.query(Marsruut).filter(
                Marsruut.id == marsruut_id).first()

            for index, ids in enumerate(reaalne_marsruut.peatused):

                peatus = session.query(Peatus).filter(
                    Peatus.id == ids.peatus_id).first()
                stop = session.query(MarsruudidPeatused).filter(
                    MarsruudidPeatused.peatus_id == ids.peatus_id, MarsruudidPeatused.marsruut_id == ids.marsruut_id).first()
                stops.append({
                    "id": peatus.id,
                    "stop": peatus.peatus,
                    "timestamp": stop.aeg
                })
            marsruudid_tüübid.add(reaalne_marsruut.tüüp)
            hind_kokku += reaalne_marsruut.hind
            marsruut_vahe.append({
                "id": reaalne_marsruut.id,
                "transportType": reaalne_marsruut.tüüp,
                "price": reaalne_marsruut.hind,
                "stops": stops
            })
        result.append({"transportType": list(marsruudid_tüübid),
                      "hind": hind_kokku, "transport": marsruut_vahe})

    return result, vahepeatused_algsed


def pilet_sobib(vahepeatused, pilet):
    graafik = pilet["transport"]
    for vahepeatus in vahepeatused:
        ajad = []
        for buss in graafik:
            for peatus in buss["stops"]:
                if peatus["stop"] == vahepeatus:
                    ajad.append(peatus["timestamp"])

        if ajad[1] < ajad[0]:
            return False
    return True


@API.get("/leia_piletid/{tyyp}/{algus}/{sihtkoht}")
async def piletid(tyyp: str, algus: str, sihtkoht: str, q: List[str] = Query(None)):
    kõik_piletid, vahepeatused_algsed = päri_marsruudid(
        tyyp, algus, sihtkoht, q)

    filtered_list = []
    print(kõik_piletid)
    if len(vahepeatused_algsed) > 0:
        for pilet in kõik_piletid:
            print(pilet["transport"])
            if pilet_sobib(vahepeatused_algsed, pilet):

                print("Sobib")
                filtered_list.append(pilet)
    else:
        filtered_list = kõik_piletid
    return filtered_list


@API.get("/valideeri/{id}")
def validate(id: int):

    with Session() as session:
        try:
            query = session.query(Pilet).filter(Pilet.id == id).first()
            if not query.kasutatud and datetime.now() < query.kestev:
                return {"kehtiv": query.kestev}
            else:
                raise HTTPException(
                    status_code=400, detail="pilet kehtetu")
        except AttributeError:
            raise HTTPException(
                status_code=400, detail="selline kirje puudub")
