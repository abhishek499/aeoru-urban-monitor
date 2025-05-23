from fastapi import APIRouter
from .user_routes import user_router
from .sensor_routes import sensor_router
from .dashboard_route import dashboard_router
from .sensor_reliability_route import sensor_reliability_router
from .websocket_routes import websocket_router

router = APIRouter()

# Include user-related routes
router.include_router(user_router, prefix="/users", tags=["Users"])
router.include_router(sensor_router, prefix="/sensor_data", tags=["Sensor Data"])
router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
router.include_router(sensor_reliability_router, prefix="/sensor_reliabilty", tags=["Sensor Reliability"])
router.include_router(websocket_router, prefix="/ws", tags=["WS"])

@router.get("/")
async def root():
    return {"message": "Welcome to the API"}