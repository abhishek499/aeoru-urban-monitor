from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.sql import func
from db import Base
from pydantic import BaseModel

class SensorReliability(Base):
    __tablename__ = "sensor_reliability"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensor_id = Column(String(255), nullable=False, unique=True)  # References the sensor ID
    score = Column(Float, nullable=False)  # Reliability score (0-100)
    variance = Column(Float, nullable=False)  # Statistical variance in the data
    update_frequency = Column(Float, nullable=False)  # Average time between updates in minutes
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # Timestamp of last update

class SensorReliabilitySchema(BaseModel):
    sensor_id: str
    score: float
    variance: float
    update_frequency: float
    last_updated: str | None = None  # ISO format timestamp

    class Config:
        orm_mode = True

    @staticmethod
    def from_orm_with_last_updated(obj: SensorReliability):
        """Custom method to handle serialization of last_updated."""
        return SensorReliabilitySchema(
            sensor_id=obj.sensor_id,
            score=obj.score,
            variance=obj.variance,
            update_frequency=obj.update_frequency,
            last_updated=obj.last_updated.isoformat() if obj.last_updated else None,
        )