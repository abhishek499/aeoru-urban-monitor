import asyncio
import random
import json
import sys
from websockets import connect, WebSocketException

async def emit_sensor_data(server_url, variance, sensor_ids, interval):
    """Emit random sensor data to the WebSocket server."""
    while True:
        try:
            async with connect(server_url) as websocket:
                print(f"Connected to WebSocket server at {server_url}")

                while True:
                    for sensor_id in sensor_ids:
                        # Generate random sensor data with the specified variance
                        sensor_data = {
                            "sensor_id": sensor_id,
                            "name": f"Sensor {sensor_id}",
                            "type": random.choice(["temperature", "humidity", "pressure", "air_quality"]),
                            "location": f"Room {random.randint(1, 10)}",
                            "value": round(random.uniform(20, 100) + random.uniform(-variance, variance), 2),
                            "unit": random.choice(["°C", "%", "hPa", "AQI"]),
                            "status": random.choice(["online", "offline", "warning", "error"]),
                        }

                        # Send the data to the WebSocket server
                        await websocket.send(json.dumps(sensor_data))
                        print(f"Sent data: {sensor_data}")

                    # Wait for the specified interval before sending the next batch
                    await asyncio.sleep(interval)

        except WebSocketException as e:
            print(f"WebSocket error: {e}")
            print("Reconnecting in 5 seconds...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"Unexpected error: {e}")
            break

if __name__ == "__main__":
    # Parse command-line arguments
    if len(sys.argv) < 5:
        print("Usage: python sensor_data_emission.py <server_url> <variance> <interval> <sensor_ids>")
        print("Example: python sensor_data_emission.py ws://127.0.0.1:8000/sensor_data/ws/sensor-data 5 2 sensor_1,sensor_2,sensor_3")
        sys.exit(1)

    server_url = sys.argv[1]  # WebSocket server URL
    variance = float(sys.argv[2])  # Variance in sensor data
    interval = float(sys.argv[3])  # Time interval between emissions (in seconds)
    sensor_ids = sys.argv[4].split(",")  # List of sensor IDs (comma-separated)

    # Run the emission script
    asyncio.run(emit_sensor_data(server_url, variance, sensor_ids, interval))