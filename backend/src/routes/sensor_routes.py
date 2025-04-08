from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from models.sensor_data import SensorDataSchema
from controllers.sensor_controller import get_sensor_data, create_sensor_data
from db import get_db

sensor_router = APIRouter(tags=["Sensor Data"])

# In-memory storage for connected WebSocket clients
active_connections = []

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
    # Notify all connected WebSocket clients about the new data
    await notify_clients(created_data)
    return created_data

@sensor_router.websocket("/ws/sensor-data")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint to send and receive sensor data."""
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Wait for data from the client
            data = await websocket.receive_json()
            # Process the received data (e.g., log it or store it)
            print(f"Received data: {data}")
            # Optionally, send a response back to the client
            await websocket.send_json({"message": "Data received", "data": data})
    except WebSocketDisconnect:
        # Remove the client from active connections on disconnect
        active_connections.remove(websocket)
        print("WebSocket client disconnected")

async def notify_clients(data: SensorDataSchema):
    """Notify all connected WebSocket clients with new sensor data."""
    for connection in active_connections:
        try:
            await connection.send_json({"event": "new_sensor_data", "data": data.dict()})
        except Exception as e:
            print(f"Failed to send data to a client: {e}")