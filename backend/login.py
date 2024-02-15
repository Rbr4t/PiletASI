from fastapi import APIRouter, Form, HTTPException
from typing import Annotated
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import select

from struktuurid import Kasutaja
from andmebaas import Session

auth = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verifeeri_parool(parool, hasheeritud_parool):
    return pwd_context.verify(parool, hasheeritud_parool)


def saa_parooli_hash(parool):
    return pwd_context.hash(parool)


@auth.get("/")
def index():
    return {"status": 200}


class RegistreeriStruct(BaseModel):
    eesnimi: str
    perekonnanimi: str
    email: str
    parool: str


@auth.post("/registreeri")
async def register(andmed: RegistreeriStruct):
    print("here")

    if "" in [andmed.eesnimi, andmed.parool, andmed.email, andmed.perekonnanimi]:
        raise HTTPException(status_code=403, detail="Vigased andmed")
    try:
        with Session() as session:
            obj = Kasutaja(nimi=f"{andmed.eesnimi} {andmed.perekonnanimi}",
                           email=andmed.email, hashed_parool=saa_parooli_hash(andmed.parool))
            session.add(obj)
            session.commit()
    except:
        raise HTTPException(
            status_code=403, detail="Selline kasutaja juba eksisteerib, logi sisse")

    # TODO: redirecti kasutaja tagasi

    return {"status": 200}


class LoginCredentials(BaseModel):
    email: str
    parool: str


@auth.post("/login")
async def login(credentials: LoginCredentials):
    session = Session()
    with Session() as session:

        user = session.query(Kasutaja).filter(
            Kasutaja.email == credentials.email).first()

        if user is None:
            raise HTTPException(
                status_code=401, detail="Vale parool või email")
            return {"status": 401}

        elif verifeeri_parool(credentials.parool, user.hashed_parool):
            return {"status": 200}

    # TODO: generate a token and add it to the session with expiration
    # TODO: proceed to the admin page or whatever
    raise HTTPException(
        status_code=401, detail="Vale parool või email")
    return {"status": 401}
