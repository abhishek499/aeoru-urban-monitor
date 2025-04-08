from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from models.sensor_data import SensorData
from datetime import datetime, timedelta

async def get_total_sensors(db: AsyncSession):
    """Get the total number of unique sensors."""
    result = await db.execute(select(func.count(SensorData.sensor_id.distinct())))
    return result.scalar()

async def get_online_sensors(db: AsyncSession):
    """Get the number of sensors that sent data in the last 5 minutes."""
    five_minutes_ago = datetime.utcnow() - timedelta(minutes=5)
    result = await db.execute(
        select(func.count(SensorData.sensor_id.distinct())).where(SensorData.created_at >= five_minutes_ago)
    )
    return result.scalar()

async def get_warning_sensors(db: AsyncSession):
    """Get the number of sensors with warnings/errors (e.g., AQI > 100)."""
    result = await db.execute(
        select(func.count(SensorData.sensor_id.distinct())).where(SensorData.aqi > 100)
    )
    return result.scalar()

async def get_average_reliability(db: AsyncSession):
    """Calculate the average reliability of sensors."""
    # Example: Assume reliability is inversely proportional to AQI
    result = await db.execute(
        select(func.avg(100 - SensorData.aqi)).where(SensorData.aqi <= 100)
    )
    avg_reliability = result.scalar()
    return round(avg_reliability, 2) if avg_reliability else 0.0