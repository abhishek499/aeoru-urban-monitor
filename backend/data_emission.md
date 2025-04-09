## **Sensor Data Emission**

The sensor_data_emission.py script simulates sensor data and emits it to a WebSocket server at regular intervals. It generates random sensor readings for specified sensors, with configurable variance and emission frequency.

---

## **Features**

- Simulates multiple sensors with specific IDs provided as input.
- Generates random sensor readings for:
  - Temperature
  - Humidity
  - Pressure
  - Visibility
  - Air Quality Index (AQI)
  - Occupancy
- Allows customization of:
  - Variance in sensor readings.
  - Time interval between emissions.
- Sends the generated data to a specified WebSocket server.
- Handles WebSocket disconnections and retries automatically.

---

## **Usage**

### **Command-Line Arguments**

The script accepts the following command-line arguments:

1. **`server_url`**:

   - The WebSocket server URL to which the sensor data will be sent.
   - Example: `ws://127.0.0.1:8000/sensor_data/ws/sensor-data`

2. **`variance`**:

   - The range of random variations in sensor readings.
   - Example: `5` (±5 variation in sensor values).

3. **`interval`**:

   - The time interval (in seconds) between emissions.
   - Example: `2` (emit data every 2 seconds).

4. **`sensor_ids`**:
   - A comma-separated list of sensor IDs for which data will be emitted.
   - Example: `sensor_1,sensor_2,sensor_3`.

### **Example Command**

```bash
python sensor_data_emission.py ws://127.0.0.1:8000/sensor_data/ws/sensor-data 5 2 sensor_1,sensor_2,sensor_3
```

---

## **Generated Sensor Data**

The script generates sensor data in the following format:

```json
{
  "sensor_id": "sensor_1",
  "temperature": 27.34,
  "humidity": 48.12,
  "pressure": 1015.45,
  "visibility": 9.87,
  "aqi": 150,
  "occupancy": 5
}
```

### **Field Descriptions**

- **`sensor_id`**:
  - Unique identifier for the sensor (e.g., `sensor_1`, `sensor_2`).
- **`temperature`**:
  - Simulated temperature reading (in °C).
  - Base value: `25` ± `variance`.
- **`humidity`**:
  - Simulated humidity reading (in %).
  - Base value: `50` ± `variance`.
- **`pressure`**:
  - Simulated pressure reading (in hPa).
  - Base value: `1013` ± `variance`.
- **`visibility`**:
  - Simulated visibility reading (in km).
  - Base value: `10` ± `variance`.
- **`aqi`**:
  - Simulated Air Quality Index (AQI) value.
  - Random integer between `0` and `500`.
- **`occupancy`**:
  - Simulated occupancy count.
  - Random integer between `0` and `10`.

---

## **How It Works**

1. **Connect to WebSocket Server**:

   - The script establishes a connection to the specified WebSocket server.

2. **Generate Sensor Data**:

   - For each sensor ID provided, random values are generated for temperature, humidity, pressure, visibility, AQI, and occupancy.
   - Variations are applied to the base values using the specified `variance`.

3. **Emit Data**:

   - The generated data is sent to the WebSocket server in JSON format.

4. **Repeat**:

   - The script waits for the specified `interval` and repeats the process.

5. **Handle Disconnections**:
   - If the WebSocket connection is lost, the script retries after 5 seconds.

---

## **Error Handling**

- **WebSocket Disconnection**:

  - If the WebSocket connection is lost, the script prints an error message and retries after 5 seconds.

- **Invalid Command-Line Arguments**:
  - If fewer than 4 arguments are provided, the script displays usage instructions and exits.

---

## **Dependencies**

- **Python 3.7+**
- **Required Libraries**:
  - `asyncio`
  - `random`
  - `json`
  - `sys`
  - `websockets`

Install the `websockets` library using:

```bash
pip install websockets
```

---

## **Example Output**

The script will emit data like this:

```plaintext
Connected to WebSocket server at ws://127.0.0.1:8000/sensor_data/ws/sensor-data
Sent data: {'sensor_id': 'sensor_1', 'temperature': 27.34, 'humidity': 48.12, 'pressure': 1015.45, 'visibility': 9.87, 'aqi': 150, 'occupancy': 5}
Sent data: {'sensor_id': 'sensor_2', 'temperature': 24.89, 'humidity': 52.34, 'pressure': 1012.78, 'visibility': 10.12, 'aqi': 200, 'occupancy': 3}
Sent data: {'sensor_id': 'sensor_3', 'temperature': 26.45, 'humidity': 49.87, 'pressure': 1014.56, 'visibility': 8.45, 'aqi': 100, 'occupancy': 7}
```

---
