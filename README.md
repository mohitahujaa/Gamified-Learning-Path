# Gamified Learning Path Graph - Flask Backend

A Flask-based backend for the Gamified Learning Path Graph application.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the Flask development server:
```bash
python app.py
```

The server will run on `http://localhost:5000`

## Available Routes

- `GET /ping` - Test endpoint that returns `{"message": "pong"}`

## Project Structure

```
Gamified Learning Path Graph/
├── app.py              # Main Flask application entry point
├── requirements.txt    # Python dependencies
├── routes/            # Route blueprints
│   ├── __init__.py
│   └── test.py        # Test routes
└── README.md
```

## Adding New Routes

To add new routes, create a new file in the `routes/` directory and register the blueprint in `app.py`. Example:

1. Create `routes/new_feature.py`
2. Define your blueprint and routes
3. Import and register the blueprint in `app.py` 