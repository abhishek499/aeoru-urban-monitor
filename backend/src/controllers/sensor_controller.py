from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.sensor_data import SensorData, SensorDataSchema
from models.sensor_reliability import SensorReliability
from fastapi import HTTPException
from datetime import datetime, timedelta
from routes.websocket_routes import notify_clients

# Variance Calculation
def calculate_variance(measurements):
    if len(measurements) <= 1:
        return 0.0
    mean = sum(measurements) / len(measurements)
    return sum((x - mean) ** 2 for x in measurements) / len(measurements)

# Update Frequency Score Calculation
def calculate_update_frequency_score(timestamps, expected_interval, weights=(0.3, 0.3, 0.4)):
    if len(timestamps) <= 1:
        return 0.0
    intervals = [(timestamps[i] - timestamps[i - 1]).total_seconds() for i in range(1, len(timestamps))]
    mean_interval = sum(intervals) / len(intervals)
    interval_ratio = min(mean_interval, expected_interval) / max(mean_interval, expected_interval)
    std_dev = (sum((i - mean_interval) ** 2 for i in intervals) / len(intervals)) ** 0.5
    consistency = max(0, 1 - (std_dev / mean_interval)) if mean_interval > 0 else 0
    total_duration = (timestamps[-1] - timestamps[0]).total_seconds()
    expected_updates = total_duration / expected_interval
    missing_ratio = max(0, min(1, 1 - (len(timestamps) / expected_updates))) if expected_updates > 0 else 0
    w1, w2, w3 = weights
    return w1 * interval_ratio + w2 * consistency + w3 * (1 - missing_ratio)

# Reliability Score Calculation
def calculate_reliability_score(variance_score, frequency_score, weights=(0.5, 0.5)):
    alpha, beta = weights
    return alpha * variance_score + beta * frequency_score

async def create_sensor_data(sensor_data: SensorDataSchema, db: AsyncSession):
    """Insert new sensor data into the database, calculate reliability metrics, and notify WebSocket clients."""
    # Check if a record with the same sensor_id already exists
    result = await db.execute(select(SensorData).where(SensorData.sensor_id == sensor_data.sensor_id))
    existing_sensor = result.scalars().first()

    # if existing_sensor:
    #     raise HTTPException(
    #         status_code=400,
    #         detail=f"Sensor with ID '{sensor_data.sensor_id}' already exists."
    #     )

    # Create a new sensor record
    new_sensor = SensorData(**sensor_data.dict())
    db.add(new_sensor)
    await db.commit()
    await db.refresh(new_sensor)  # Refresh to get the auto-generated ID

    # Fetch all historical data for the sensor
    historical_query = select(SensorData).where(SensorData.sensor_id == sensor_data.sensor_id).order_by(SensorData.timestamp)
    historical_result = await db.execute(historical_query)
    historical_data = historical_result.scalars().all()

    # Extract measurements and timestamps
    measurements = [data.value for data in historical_data]
    timestamps = [data.timestamp for data in historical_data]

    # Calculate variance
    variance = calculate_variance(measurements)

    # Calculate update frequency score (assuming expected interval is 600 seconds = 10 minutes)
    expected_interval = 600
    update_frequency_score = calculate_update_frequency_score(timestamps, expected_interval)

    # Calculate reliability score
    variance_score = 1 - (variance / max(variance, 1))  # Normalize variance score
    reliability_score = calculate_reliability_score(variance_score, update_frequency_score)

    # Update or insert into the sensor_reliability table
    reliability_query = select(SensorReliability).where(SensorReliability.sensor_id == sensor_data.sensor_id)
    reliability_result = await db.execute(reliability_query)
    existing_reliability = reliability_result.scalars().first()

    if existing_reliability:
        # Update existing record
        existing_reliability.variance = variance
        existing_reliability.update_frequency = update_frequency_score
        existing_reliability.score = reliability_score
        existing_reliability.last_updated = datetime.utcnow()
    else:
        # Insert new record
        new_reliability = SensorReliability(
            sensor_id=sensor_data.sensor_id,
            variance=variance,
            update_frequency=update_frequency_score,
            score=reliability_score,
            last_updated=datetime.utcnow()
        )
        db.add(new_reliability)

    await db.commit()

    # Notify WebSocket clients
    await notify_clients(db)

    return new_sensor

async def get_sensor_data(db: AsyncSession):
    """Fetch all sensor data from the database."""
    result = await db.execute(select(SensorData))
    return result.scalars().all()