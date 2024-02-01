from fastapi import APIRouter, Form
from typing import Annotated
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import select

from models import User
from database import Session

auth = APIRouter()

# TODO: Move it to .env file for safety
SECRET_KEY_DEV = "533b5ead140826670211957272b78d019d3132e4e0f6110f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


@auth.get("/")
def index():
    return {"status": "success"}


@auth.post("/register")
def register(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    email: Annotated[str, Form()],
    real_name: Annotated[str, Form()]
):
    """
    I'll be using FormData instead of regular post request,
    so that you can send credentials safely to the server as one package
    + this way we can make it through native html <form> element
    """
    if any([username, password, email, real_name]) is None:
        return {"status": 403}
    with Session() as session:
        obj = User(username=username, real_name=real_name,
                   email=email, password=get_password_hash(password))
        session.add(obj)
        session.commit()

    # TODO: redirect user to login screen after that

    return {"status": 200}


class LoginCredentials(BaseModel):
    username: str
    hashed_password: str


@auth.post("/login")
def login(credentials: LoginCredentials):
    session = Session()
    user = select(User).where(User.username == credentials.username)
    if user == -1:
        return {"status": 401}
    if verify_password(credentials.hashed_password, user.hashed_password):
        return {"status": 401}

    # TODO: generate a token and add it to the session with expiration
    # TODO: proceed to the admin page or whatever

    return {"status": 200}
