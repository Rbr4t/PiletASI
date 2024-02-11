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
    marsruut_id = Column(Integer, ForeignKey("marsruudid.id"))
    ostetud = Column(DateTime(timezone=True), server_default=func.now())
    kestev = Column(Integer, nullable=False)


class Marsruut(Base):
    __tablename__ = "marsruudid"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tüüp = Column(String, nullable=False)
    hind = Column(Integer, nullable=False, default=0)
    loodud = Column(DateTime(timezone=True), server_default=func.now())
    peatused = relationship("Peatus", backref="marsruudid")


class Peatus(Base):
    __tablename__ = "peatused"

    id = Column(Integer, primary_key=True, autoincrement=True)
    marsruudi_id = Column(Integer, ForeignKey("marsruudid.id"), nullable=False)
    peatus = Column(String, nullable=False)
    aeg = Column(DateTime(timezone=True), nullable=False)
