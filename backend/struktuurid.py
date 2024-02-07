from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from andmebaas import Base


class Kasutaja(Base):
    __tablename__ = "kasutajad"

    id = Column(Integer, primary_key=True, autoincrement=True)
    kasutajanimi = Column(String, unique=True, nullable=False)
    nimi = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_parool = Column(String, nullable=False)

    piletid = relationship("Pilet", backref="kasutajad")


class Pilet(Base):
    __tablename__ = 'piletid'

    id = Column(Integer, primary_key=True, autoincrement=True)
    kasutaja_id = Column(Integer, ForeignKey("kasutajad.id"))
    ostetetud = Column(DateTime(timezone=True), server_default=func.now())
    kestev = Column(Integer, nullable=False)
