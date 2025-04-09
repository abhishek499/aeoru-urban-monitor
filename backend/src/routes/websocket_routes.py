from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.sensor_data import SensorData
from models.sensor_reliability import SensorReliability
from db import get_db
import asyncio

websocket_router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    """Manages WebSocket connections."""
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Send a message to all connected clients."""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(connection)


manager = ConnectionManager()


@websocket_router.websocket("/sensor-dashboard")
async def websocket_endpoint(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    """
    WebSocket endpoint to send real-time dashboard updates.
    """
    await manager.connect(websocket)
    try:
        # Send initial data to the client
        await send_initial_data(websocket, db)

        # Keep the connection alive
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


async def send_initial_data(websocket: WebSocket, db: AsyncSession):
    """
    Send the initial dashboard data to the connected WebSocket client.
    """
    # Fetch all sensor data
    sensor_data_query = select(SensorData)
    sensor_data_result = await db.execute(sensor_data_query)
    all_sensor_data = sensor_data_result.scalars().all()

    # Fetch all sensor reliability data
    reliability_query = select(SensorReliability)
    reliability_result = await db.execute(reliability_query)
    all_reliability_data = {r.sensor_id: r for r in reliability_result.scalars().all()}

    # Combine sensor data with reliability data
    combined_sensor_data = []
    for sensor in all_sensor_data:
        reliability = all_reliability_data.get(sensor.sensor_id)
        combined_sensor_data.append({
            "sensor_id": sensor.sensor_id,
            "name": sensor.name,
            "type": sensor.type.value,
            "location": sensor.location,
            "value": sensor.value,
            "unit": sensor.unit,
            "timestamp": sensor.timestamp.isoformat(),
            "status": sensor.status.value,
            "reliability_score": reliability.score if reliability else None,
            "data_variance": reliability.variance if reliability else None,
            "update_frequency": reliability.update_frequency if reliability else None,
        })

    # Calculate dashboard summary
    total_sensors = len(all_sensor_data)
    online_sensors = sum(1 for sensor in all_sensor_data if sensor.status.value == "online")
    warning_sensors = sum(1 for sensor in all_sensor_data if sensor.status.value in ["warning", "error"])
    average_reliability = (
        sum(r.score for r in all_reliability_data.values()) / len(all_reliability_data)
        if all_reliability_data else 0
    )

    dashboard_summary = {
        "total_sensors": total_sensors,
        "online_sensors": online_sensors,
        "warning_sensors": warning_sensors,
        "average_reliability": round(average_reliability, 2),
    }

    # Combine dashboard summary and sensor details
    message = {
        "dashboard": dashboard_summary,
        "sensors": combined_sensor_data,
    }

    # Send the initial data to the connected client
    await websocket.send_json(message)


async def notify_clients(db: AsyncSession):
    """
    Notify all connected WebSocket clients with the updated dashboard data.
    """
    # Fetch all sensor data
    sensor_data_query = select(SensorData)
    sensor_data_result = await db.execute(sensor_data_query)
    all_sensor_data = sensor_data_result.scalars().all()

    # Fetch all sensor reliability data
    reliability_query = select(SensorReliability)
    reliability_result = await db.execute(reliability_query)
    all_reliability_data = {r.sensor_id: r for r in reliability_result.scalars().all()}

    # Combine sensor data with reliability data
    combined_sensor_data = []
    for sensor in all_sensor_data:
        reliability = all_reliability_data.get(sensor.sensor_id)
        combined_sensor_data.append({
            "sensor_id": sensor.sensor_id,
            "name": sensor.name,
            "type": sensor.type.value,
            "location": sensor.location,
            "value": sensor.value,
            "unit": sensor.unit,
            "timestamp": sensor.timestamp.isoformat(),
            "status": sensor.status.value,
            "reliability_score": reliability.score if reliability else None,
            "data_variance": reliability.variance if reliability else None,
            "update_frequency": reliability.update_frequency if reliability else None,
        })

    # Calculate dashboard summary
    total_sensors = len(all_sensor_data)
    online_sensors = sum(1 for sensor in all_sensor_data if sensor.status.value == "online")
    warning_sensors = sum(1 for sensor in all_sensor_data if sensor.status.value in ["warning", "error"])
    average_reliability = (
        sum(r.score for r in all_reliability_data.values()) / len(all_reliability_data)
        if all_reliability_data else 0
    )

    dashboard_summary = {
        "total_sensors": total_sensors,
        "online_sensors": online_sensors,
        "warning_sensors": warning_sensors,
        "average_reliability": round(average_reliability, 2),
    }

    # Combine dashboard summary and sensor details
    message = {
        "dashboard": dashboard_summary,
        "sensors": combined_sensor_data,
    }

    # Broadcast the data to all connected clients
    await manager.broadcast(message)