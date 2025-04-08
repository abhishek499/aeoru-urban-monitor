import asyncio
import random
import json
import sys
from websockets import connect

async def emit_sensor_data(server_url, variance, num_sensors, interval):
    """Emit random sensor data to the WebSocket server."""
    try:
        async with connect(server_url) as websocket:
            print(f"Connected to WebSocket server at {server_url}")

            # Generate unique sensor IDs
            sensor_ids = [f"sensor_{i+1}" for i in range(num_sensors)]

            while True:
                for sensor_id in sensor_ids:
                    # Generate random sensor data with the specified variance
                    sensor_data = {
                        "sensor_id": sensor_id,
                        "temperature": round(25 + random.uniform(-variance, variance), 2),
                        "humidity": round(50 + random.uniform(-variance, variance), 2),
                        "pressure": round(1013 + random.uniform(-variance, variance), 2),
                        "visibility": round(10 + random.uniform(-variance, variance), 2),
                        "aqi": random.randint(0, 500),
                        "occupancy": random.randint(0, 10),
                    }

                    # Send the data to the WebSocket server
                    await websocket.send(json.dumps(sensor_data))
                    print(f"Sent data: {sensor_data}")

                # Wait for the specified interval before sending the next batch
                await asyncio.sleep(interval)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Parse command-line arguments
    if len(sys.argv) != 5:
        print("Usage: python start_sensor_data_emission.py <server_url> <variance> <num_sensors> <interval>")
        print("Example: python start_sensor_data_emission.py ws://127.0.0.1:8000/ws/sensor-data 5 3 2")
        sys.exit(1)

    server_url = sys.argv[1]  # WebSocket server URL
    variance = float(sys.argv[2])  # Variance in sensor data
    num_sensors = int(sys.argv[3])  # Number of sensors
    interval = float(sys.argv[4])  # Time interval between emissions (in seconds)

    # Run the emission script
    asyncio.run(emit_sensor_data(server_url, variance, num_sensors, interval))