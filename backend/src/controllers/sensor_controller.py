from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.sensor_data import SensorData, SensorDataSchema

async def get_sensor_data(db: AsyncSession):
    """Fetch all sensor data from the database."""
    result = await db.execute(select(SensorData))
    return result.scalars().all()

async def create_sensor_data(sensor_data: SensorDataSchema, db: AsyncSession):
    """Insert new sensor data into the database."""
    new_data = SensorData(**sensor_data.dict())
    db.add(new_data)
    await db.commit()
    await db.refresh(new_data)  # Refresh to get the auto-generated ID
    return new_data