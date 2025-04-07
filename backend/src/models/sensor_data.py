from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.sql import func
from db import Base
from pydantic import BaseModel

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensor_id = Column(String(255), nullable=False)  # Specify length for VARCHAR
    temperature = Column(Float)
    humidity = Column(Float)
    pressure = Column(Float)
    visibility = Column(Float)
    aqi = Column(Integer)
    occupancy = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic schema for request/response validation
class SensorDataSchema(BaseModel):
    sensor_id: str
    temperature: float
    humidity: float
    pressure: float
    visibility: float
    aqi: int
    occupancy: int

    class Config:
        orm_mode = True