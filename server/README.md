# Server Files

This directory contains the Flask server for the Bangalore Home Price Prediction application.

## Files

- **app.py** - Main Flask application (recommended to use this)
- **server.py** - Alternative entry point (same functionality, for backward compatibility)
- **util.py** - Utility functions for model loading and price prediction
- **artifacts/** - Contains the trained model and data columns

## Running the Server

### Option 1: Using app.py (Recommended)
```bash
cd server
python app.py
```

### Option 2: Using server.py
```bash
cd server
python server.py
```

### Option 3: Using Flask command
```bash
cd server
flask --app app run
```

## Server Endpoints

- `GET /` - Serves the main HTML page
- `GET /get_location_names` - Returns list of available locations
- `POST /predict_home_price` - Predicts home price based on input
- `GET /health` - Health check endpoint

## Requirements

Make sure you have installed all dependencies:
```bash
pip install -r ../requirements.txt
```

## Server Configuration

The server runs on:
- **Host**: 127.0.0.1
- **Port**: 5000
- **URL**: http://127.0.0.1:5000

## Troubleshooting

1. **Model not loading**: Ensure `artifacts/` folder contains:
   - `columns.json`
   - `banglore_home_prices_model.pickle`

2. **Port already in use**: Change the port in app.py or server.py:
   ```python
   app.run(debug=True, host='127.0.0.1', port=5001)
   ```

3. **CORS errors**: CORS headers are already configured for all endpoints.

