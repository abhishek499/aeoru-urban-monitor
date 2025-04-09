from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db
from models.sensor_reliability import SensorReliabilitySchema

sensor_reliability_router = APIRouter(tags=["Sensor Reliability"])

@sensor_reliability_router.get("/{sensor_id}", response_model=SensorReliabilitySchema)
async def fetch_sensor_reliability(sensor_id: str, db: AsyncSession = Depends(get_db)):
    """
    API to fetch reliability data for a specific sensor.
    """
    # Import inside the function to avoid circular import
    from controllers.sensor_reliability_controller import get_sensor_reliability
    return await get_sensor_reliability(sensor_id, db)

@sensor_reliability_router.post("/", response_model=SensorReliabilitySchema)
async def add_or_update_sensor_reliability(sensor_data: SensorReliabilitySchema, db: AsyncSession = Depends(get_db)):
    """
    API to create or update reliability data for a specific sensor.
    """
    # Import inside the function to avoid circular import
    from controllers.sensor_reliability_controller import create_or_update_sensor_reliability
    return await create_or_update_sensor_reliability(sensor_data, db)