import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse

from api import API
from andmebaas import engine, Base


if not os.path.isfile("./../tickets.db"):
    Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"),
          name="assets")
templates = Jinja2Templates(directory="../frontend/dist")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.include_router(API, prefix='/api')


# Jinja2 mallimootoriga Reacti lehele suunamine
@app.get("/")
async def serve_spa(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/{rest_of_path:path}")
async def react_app(req: Request, rest_of_path: str):
    return templates.TemplateResponse('index.html', {'request': req})
