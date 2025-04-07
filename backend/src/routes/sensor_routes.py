from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from models.sensor_data import SensorDataSchema
from controllers.sensor_controller import get_sensor_data, create_sensor_data
from db import get_db

sensor_router = APIRouter(tags=["Sensor Data"])

@sensor_router.get("/", response_model=list[SensorDataSchema])
async def list_sensor_data(db: AsyncSession = Depends(get_db)):
    """API to fetch all sensor data."""
    return await get_sensor_data(db)

@sensor_router.post("/", response_model=SensorDataSchema)
async def add_sensor_data(sensor_data: SensorDataSchema, db: AsyncSession = Depends(get_db)):
    """API to create new sensor data."""
    created_data = await create_sensor_data(sensor_data, db)
    if not created_data:
        raise HTTPException(status_code=400, detail="Failed to create sensor data")
    return created_data