from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from andmebaas import Base
from datetime import datetime, timedelta


class Kasutaja(Base):
    __tablename__ = "kasutajad"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nimi = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_parool = Column(String, nullable=False)

    piletid = relationship("Pilet", backref="kasutajad")


class Pilet(Base):
    __tablename__ = 'piletid'

    id = Column(Integer, primary_key=True, autoincrement=True)
    kasutaja_id = Column(Integer, ForeignKey("kasutajad.id"), nullable=True)
    marsruudid = relationship("PiletiPeatused", backref="piletid")
    ostetud = Column(DateTime(timezone=True), server_default=func.now())
    kestev = Column(DateTime(timezone=True),
                    default=datetime.utcnow() + timedelta(days=30))
    kasutatud = Column(Boolean, default=False)


class PiletiPeatused(Base):
    __tablename__ = 'piletid_peatused'
    id = Column(Integer, primary_key=True, autoincrement=True)
    pilet_id = Column(Integer, ForeignKey("piletid.id"))
    marsruut_id = Column(Integer, ForeignKey("marsruudid.id"))


class Marsruut(Base):
    __tablename__ = "marsruudid"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tüüp = Column(String, nullable=False)
    hind = Column(Integer, nullable=False, default=0)
    loodud = Column(DateTime(timezone=True), server_default=func.now())
    peatused = relationship("MarsruudidPeatused", backref="marsruudid")


class Peatus(Base):
    __tablename__ = "peatused"

    id = Column(Integer, primary_key=True, autoincrement=True)
    peatus = Column(String, nullable=False)


class MarsruudidPeatused(Base):
    __tablename__ = "marsruudid_peatused"

    id = Column(Integer, primary_key=True, autoincrement=True)
    marsruut_id = Column(Integer, ForeignKey("marsruudid.id"))
    peatus_id = Column(Integer, ForeignKey("peatused.id"))
    aeg = Column(DateTime(timezone=True), nullable=False)
