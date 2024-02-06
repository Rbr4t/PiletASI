from fastapi import APIRouter, Form
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


@auth.post("/registreeri")
def register(
    kasutajanimi: Annotated[str, Form()],
    parool: Annotated[str, Form()],
    email: Annotated[str, Form()],
    nimi: Annotated[str, Form()]
):
    """
    I'll be using FormData instead of regular post request,
    so that you can send credentials safely to the server as one package
    + this way we can make it through native html <form> element
    """
    if any([kasutajanimi, parool, email, nimi]) is None:
        return {"status": 403}
    with Session() as session:
        obj = Kasutaja(kasutajanimi=kasutajanimi, nimi=nimi,
                       email=email, hashed_parool=saa_parooli_hash(parool))
        session.add(obj)
        session.commit()

    # TODO: redirecti kasutaja tagasi

    return {"status": 200}


class LoginCredentials(BaseModel):
    kasutajanimi: str
    hashed_parool: str


@auth.post("/login")
def login(credentials: LoginCredentials):
    session = Session()
    user = select(Kasutaja).where(
        Kasutaja.username == credentials.kasutajanimi)
    if user == -1:
        return {"status": 401}
    if verifeeri_parool(credentials.hashed_password, user.hashed_password):
        return {"status": 401}

    # TODO: generate a token and add it to the session with expiration
    # TODO: proceed to the admin page or whatever

    return {"status": 200}
