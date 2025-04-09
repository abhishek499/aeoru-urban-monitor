from sqlalchemy import Column, String, Float, Integer, DateTime, Enum
from sqlalchemy.sql import func
from db import Base
from pydantic import BaseModel, validator
from datetime import datetime
from enum import Enum as PyEnum

# Enum for sensor type
class SensorType(PyEnum):
    TEMPERATURE = "temperature"
    HUMIDITY = "humidity"
    PRESSURE = "pressure"
    AIR_QUALITY = "air_quality"

# Enum for sensor status
class SensorStatus(PyEnum):
    ONLINE = "online"
    OFFLINE = "offline"
    WARNING = "warning"
    ERROR = "error"

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sensor_id = Column(String(255), nullable=False)  # Unique identifier for the sensor
    name = Column(String(255), nullable=False)  # Display name for the sensor
    type = Column(Enum(SensorType), nullable=False)  # Sensor type
    location = Column(String(255), nullable=False)  # Location where the sensor is installed
    value = Column(Float, nullable=False)  # Current reading value
    unit = Column(String(50), nullable=False)  # Measurement unit (e.g., °C, %, hPa, AQI)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # ISO format timestamp of the reading
    status = Column(Enum(SensorStatus), nullable=False)  # Current operational status

class SensorDataSchema(BaseModel):
    id: int | None = None  # Optional for creation, required for responses
    sensor_id: str
    name: str
    type: SensorType
    location: str
    value: float
    unit: str
    timestamp: str | None = None  # Optional field for request payload
    status: SensorStatus

    class Config:
        orm_mode = True

    @validator("timestamp", pre=True, always=True)
    def convert_timestamp_to_string(cls, value):
        """Convert datetime to ISO 8601 string."""
        if isinstance(value, datetime):
            return value.isoformat()
        return value