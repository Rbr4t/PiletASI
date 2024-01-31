
from datetime import datetime
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/generate/{type}/{id}")
def read_item(type: str, id: int, expiry=30):
    # Ticket type (String)
    # Ticket purchace date
    # Ticket ID
    # and custom expiry(or not)
    today = datetime.now().isoformat()
    ticket_today = str(today).translate(
        str.maketrans({'-': '', ':': '', '.': '', ' ': ''}))

    ticket = type + ticket_today + "E" + \
        str(expiry) + "I" + "{:>6}".format(id)

    return {"ticket": ticket}
