## **Development Journey**

This document outlines the step-by-step process followed during the development of the `aeoru-urban-monitor` project. The project was divided into multiple iterations, each focusing on specific goals and deliverables.

---

## **Timeline**

### **Iteration 1: Project Setup**

**Goals**:

- Set up the project structure for both backend and frontend.
- Configure the backend with FastAPI and MySQL.
- Create initial models for `sensor_data`.

**Tasks Completed**:

1. Initialized the project repository and created separate directories for `backend` and `frontend`.
2. Configured the backend environment:
   - Installed FastAPI for building the API.
   - Set up MySQL as the database and configured the connection.
3. Created the `sensor_data` model to store sensor readings in the database.
4. Designed the initial schema for sensor data, including fields like `sensor_id`, `type`, `value`, `timestamp`, etc.

**Challenges**:

- Understanding the requirements for the reliability score calculation.
- Deciding on the database schema to accommodate future features.

---

### **Iteration 2: Backend Core Features**

**Goals**:

- Implement WebSocket for real-time updates.
- Design and implement the reliability score calculation.

**Tasks Completed**:

1. Implemented a WebSocket endpoint in the backend to handle real-time data updates.
2. Designed the formula for the reliability score:
   - **Variance Score**: Measures the consistency of sensor readings.
   - **Update Frequency Score**: Evaluates how regularly the sensor sends data.
   - Combined the two scores into a weighted reliability score.
3. Created the `sensor_reliability` model to store reliability scores for each sensor.
4. Added logic to calculate and update the reliability score whenever new sensor data is received.

**Challenges**:

- Balancing the weights for variance and update frequency in the reliability score formula.
- Ensuring the WebSocket implementation could handle multiple clients simultaneously.

**Key Decisions**:

- Chose WebSocket over polling for real-time updates to reduce latency and improve performance.

---

### **Iteration 3: Frontend Development**

**Goals**:

- Build the frontend using Next.js.
- Integrate WebSocket for real-time data display.
- Add charts and graphs for sensor data visualization.

**Tasks Completed**:

1. Set up the frontend environment using Next.js.
2. Integrated WebSocket to receive live updates from the backend.
3. Designed a responsive dashboard to display sensor data in real-time.
4. Added charts and graphs using `chart.js` to visualize:
   - Historical sensor data.
   - Reliability scores for each sensor.
5. Implemented error state handling to display warnings for offline or malfunctioning sensors.

**Technologies Used**:

- **Next.js**: For server-side rendering (SSR) and client-side rendering (CSR) to optimize performance and SEO.
- **WebSocket API**: For real-time communication with the backend.
- **Chart.js**: For creating interactive charts and graphs.
- **Tailwind CSS**: For responsive and modern UI design.

**Challenges**:

- Ensuring the frontend dynamically updates without page reloads.
- Designing a clean and responsive UI for both desktop and mobile devices.

**Key Decisions**:

- Used Next.js for its SSR capabilities to improve performance and SEO.
- Chose `chart.js` for its simplicity and flexibility in creating visualizations.
- Used Tailwind CSS for rapid and consistent styling.

---

### **Iteration 4: Error Handling, Testing, and Documentation**

**Goals**:

- Add comprehensive error handling and logging.
- Test the application with sample data.
- Document the project for submission.

**Tasks Completed**:

1. Added error handling in the backend:
   - Handled WebSocket disconnections and retries.
   - Wrapped database operations in try-except blocks to catch and log errors.
2. Tested the application:
   - Simulated sensor data using the `sensor_data_emission.py` script.
   - Verified real-time updates and reliability score calculations.
3. Documented the project:
   - Created a detailed `README.md` with setup instructions and an overview of the project.
   - Wrote this `PROCESS.md` to document the development journey.

**Challenges**:

- Debugging WebSocket disconnections during testing.
- Ensuring the reliability score calculations were accurate with varying data inputs.

**Key Decisions**:

- Added retry logic for WebSocket connections to improve robustness.
- Logged errors to a file for easier debugging and monitoring.

---

## **Summary of Iterations**

| **Iteration** | **Focus**                                  | **Key Deliverables**                                                                 |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| **1**         | Project Setup                              | Backend structure, MySQL configuration, `sensor_data` model.                         |
| **2**         | Backend Core Features                      | WebSocket implementation, reliability score calculation, `sensor_reliability` model. |
| **3**         | Frontend Development                       | Next.js dashboard, WebSocket integration, charts/graphs for data visualization.      |
| **4**         | Error Handling, Testing, and Documentation | Error handling, testing with sample data, `README.md` and `PROCESS.md`.              |

---

## **Challenges and Solutions**

### **Challenge 1: Real-Time Updates**

- **Problem**: Implementing real-time updates with WebSocket required handling multiple clients and ensuring data consistency.
- **Solution**: Used Python's `websockets` library for the backend and Next.js's WebSocket API for the frontend. Implemented a connection manager to handle multiple WebSocket connections.

### **Challenge 2: Reliability Score Calculation**

- **Problem**: Designing a meaningful formula for the reliability score that balances data variance and update frequency.
- **Solution**: Created a weighted formula combining variance and update frequency scores. Tested the formula with sample data to ensure accuracy.

### **Challenge 3: Error Handling**

- **Problem**: Handling WebSocket disconnections and database errors without crashing the application.
- **Solution**: Added retry logic for WebSocket connections and wrapped database operations in try-except blocks.

---

## **Improvements for the Future**

1. **Advanced Visualizations**:

   - Add more detailed and interactive charts for sensor data analysis.

2. **Caching Layer**:

   - Implement a caching layer (e.g., Redis) to reduce database load and improve performance.

3. **Testing**:

   - Add unit tests for backend logic and frontend components to ensure reliability.

4. **Scalability**:
   - Optimize the WebSocket implementation to handle a larger number of concurrent clients.

---
