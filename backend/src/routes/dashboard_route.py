from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db
from controllers.dashboard_controller import (
    get_total_sensors,
    get_online_sensors,
    get_warning_sensors,
    get_average_reliability,
)

dashboard_router = APIRouter(tags=["Dashboard"])

# In-memory storage for connected WebSocket clients
dashboard_connections = []

@dashboard_router.get("/")
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    """API to get all dashboard metrics in a single response."""
    total = await get_total_sensors(db)
    online = await get_online_sensors(db)
    warnings = await get_warning_sensors(db)
    reliability = await get_average_reliability(db)

    return {
        "total_sensors": total,
        "online_sensors": online,
        "warning_sensors": warnings,
        "average_reliability": reliability,
    }

@dashboard_router.websocket("/ws/dashboard")
async def dashboard_websocket(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    """WebSocket endpoint to send real-time dashboard updates."""
    await websocket.accept()
    dashboard_connections.append(websocket)
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        dashboard_connections.remove(websocket)
        print("Dashboard WebSocket client disconnected")

async def notify_dashboard_clients(db: AsyncSession):
    """Notify all connected WebSocket clients with updated dashboard metrics."""
    total = await get_total_sensors(db)
    online = await get_online_sensors(db)
    warnings = await get_warning_sensors(db)
    reliability = await get_average_reliability(db)

    data = {
        "total_sensors": total,
        "online_sensors": online,
        "warning_sensors": warnings,
        "average_reliability": reliability,
    }

    for connection in dashboard_connections:
        try:
            await connection.send_json(data)
        except Exception as e:
            print(f"Failed to send data to a client: {e}")
            dashboard_connections.remove(connection)