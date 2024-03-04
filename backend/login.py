from fastapi import APIRouter, HTTPException, Depends, status
from passlib.context import CryptContext
from pydantic import BaseModel
from struktuurid import Kasutaja
from andmebaas import Session
from fastapi_login import LoginManager
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated
from jose import JWTError, jwt

SECRET_KEY = "dev"  # python -c "import os; print(os.urandom(24).hex())"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

admins = []


auth = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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

    return {"status": 200}


class LoginCredentials(BaseModel):
    email: str
    parool: str


def create_access_token(data: dict, admins):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    admin = False

    if data.get("email") in admins:
        print("Here")
        admin = True

    to_encode.update({"expire": expire.strftime(
        "%Y-%m-%d %H:%M:%S"), "admin": admin})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return encoded_jwt


def verify_token_access(token: str, admins, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)

        id: int = payload.get("id")
        admin: bool = payload.get("admin")

        if id is None:
            raise credentials_exception
        token_data = {"id": id, "admin": admin}
    except JWTError as e:
        print(e)
        raise credentials_exception

    return token_data


def read_admins():
    admins = []
    f = open("./admins.txt", mode="r")

    for x in f.readlines():
        admins += [x.strip()]
    f.close()
    return admins


@auth.post("/login")
async def login(credentials: LoginCredentials):

    async def query_user(user_email, password):
        with Session() as session:

            user = session.query(Kasutaja).filter(
                Kasutaja.email == user_email).first()

            if user is None:
                raise HTTPException(
                    status_code=401, detail="Vale parool või email")
                return {"status": 401}

            elif verifeeri_parool(password, user.hashed_parool):
                admins = read_admins()

                access_token = create_access_token(
                    {"id": user.id, "email": user_email}, admins)
                return {"access_token": access_token}

    access_token = await query_user(credentials.email, credentials.parool)
    if access_token:
        return access_token


@auth.get("/is_admin")
def get_current_user(token: str = Depends(oauth2_scheme)):

    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not Validate Credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    admins = read_admins()
    try:
        token = verify_token_access(token, admins, credentials_exception)
        if token.get("admin"):
            return True
    except:
        return False


@auth.get("/get_user_info")
def userinfo(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not Validate Credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    token = verify_token_access(token, admins, credentials_exception)
    user_id = token.get("id")
    with Session() as session:
        user = session.query(Kasutaja).filter(Kasutaja.id == user_id).first()
        return {"id": user.id, "firstName": user.nimi.split(' ', 1)[0], "lastName": user.nimi.split(' ', 1)[1], "email": user.email}
