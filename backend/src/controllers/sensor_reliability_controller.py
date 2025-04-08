from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.sensor_reliability import SensorReliability, SensorReliabilitySchema
from fastapi import HTTPException

async def get_sensor_reliability(sensor_id: str, db: AsyncSession):
    """Fetch the reliability data for a specific sensor."""
    result = await db.execute(select(SensorReliability).where(SensorReliability.sensor_id == sensor_id))
    sensor_reliability = result.scalars().first()
    if not sensor_reliability:
        raise HTTPException(status_code=404, detail=f"Sensor with ID {sensor_id} not found")
    return sensor_reliability

async def create_or_update_sensor_reliability(sensor_data: SensorReliabilitySchema, db: AsyncSession):
    """Create or update the reliability data for a specific sensor."""
    result = await db.execute(select(SensorReliability).where(SensorReliability.sensor_id == sensor_data.sensor_id))
    existing_sensor = result.scalars().first()

    if existing_sensor:
        # Update existing sensor data
        existing_sensor.reliability_score = sensor_data.reliability_score
        existing_sensor.details = sensor_data.details
    else:
        # Create new sensor data
        new_sensor = SensorReliability(
            sensor_id=sensor_data.sensor_id,
            reliability_score=sensor_data.reliability_score,
            details=sensor_data.details,
        )
        db.add(new_sensor)

    await db.commit()
    return existing_sensor or new_sensor