from fastapi import FastAPI
from routes import router as api_router
from db import engine, Base

app = FastAPI()

@app.on_event("startup")
async def startup():
    # Create tables in the database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("shutdown")
async def shutdown():
    # Any shutdown tasks can be added here
    pass

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))