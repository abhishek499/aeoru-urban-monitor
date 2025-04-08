from sqlalchemy import Column, String, Float, Integer
from db import Base
from pydantic import BaseModel

class SensorReliability(Base):
    __tablename__ = "sensor_reliability"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensor_id = Column(String(255), nullable=False, unique=True)  # Unique sensor ID
    reliability_score = Column(Float, nullable=False)  # Reliability score (0-100)
    details = Column(String(1024), nullable=True)  # Additional details about the sensor

# Pydantic schema for request/response validation
class SensorReliabilitySchema(BaseModel):
    sensor_id: str
    reliability_score: float
    details: str | None = None

    class Config:
        orm_mode = True