# FastAPI Project

This is a FastAPI project structured to include models, controllers, routes, and utility functions, along with a MySQL database connection setup.

## Project Structure

```
backend
├── src
│   ├── main.py          # Entry point of the FastAPI application
│   ├── db.py            # Database connection setup
│   ├── models           # Contains database models
│   │   └── __init__.py
│   ├── controllers      # Logic for handling requests and responses
│   │   └── __init__.py
│   ├── routes           # API routes for the application
│   │   └── __init__.py
│   └── utils            # Utility functions
│       └── __init__.py
├── requirements.txt      # Project dependencies
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository**:

   ```
   git clone <repository-url>
   cd backend1
   ```

2. **Create a virtual environment**:

   ```
   python -m venv venv
   ```

3. **Activate the virtual environment**:

   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. **Install dependencies**:

   ```
   pip install -r requirements.txt
   ```

5. **Set up the database**:
   Ensure you have a MySQL database running and update the `DATABASE_URL` in your environment variables.

6. **Run the application**:
   ```
   uvicorn src.main:app --reload
   ```

## Usage

Once the server is running, you can access the API at `http://127.0.0.1:8000`. You can also access the interactive API documentation at `http://127.0.0.1:8000/docs`.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.
