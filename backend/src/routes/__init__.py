from fastapi import APIRouter
from .user_routes import user_router
from .sensor_routes import sensor_router

router = APIRouter()

# Include user-related routes
router.include_router(user_router, prefix="/users", tags=["Users"])
router.include_router(sensor_router, prefix="/sensor_data", tags=["Sensor Data"])

@router.get("/")
async def root():
    return {"message": "Welcome to the API"}