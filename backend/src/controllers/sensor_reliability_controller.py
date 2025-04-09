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
    return SensorReliabilitySchema.from_orm_with_last_updated(sensor_reliability)

async def create_or_update_sensor_reliability(sensor_data: SensorReliabilitySchema, db: AsyncSession):
    """Create or update the reliability data for a specific sensor."""
    result = await db.execute(select(SensorReliability).where(SensorReliability.sensor_id == sensor_data.sensor_id))
    existing_sensor = result.scalars().first()

    if existing_sensor:
        # Update existing sensor data
        existing_sensor.score = sensor_data.score
        existing_sensor.variance = sensor_data.variance
        existing_sensor.update_frequency = sensor_data.update_frequency
    else:
        # Create new sensor data
        new_sensor = SensorReliability(
            sensor_id=sensor_data.sensor_id,
            score=sensor_data.score,
            variance=sensor_data.variance,
            update_frequency=sensor_data.update_frequency,
        )
        db.add(new_sensor)

    await db.commit()
    return SensorReliabilitySchema.from_orm_with_last_updated(existing_sensor or new_sensor)