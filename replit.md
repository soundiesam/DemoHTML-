# Overlay Control App

## Overview
An HTML5 application for creating and controlling streaming overlays (Lower Thirds and RSS Ticker), designed for broadcasting use. Can run on localhost with configurable port and is ready for Docker deployment.

## Features
- **Control Page** (`/`): Web interface to manage overlay elements
- **Display Page** (`/display`): Transparent background overlay for OBS/streaming software

### Lower Third Controls
- Two lines of text (name + title)
- Position options: bottom-left, bottom-center, bottom-right, top-left, top-center, top-right
- Text sizes: small, medium, large, extra large
- Auto-hide duration (0 = manual control)
- Show/Hide buttons for manual triggering

### RSS Ticker Controls
- RSS feed URL input with load button
- Position options: top, bottom
- Text sizes: small, medium, large
- Show/Hide buttons for manual triggering
- Scrolling ticker animation with feed headlines

## Project Structure
```
.
├── main.py              # Flask server with SocketIO
├── templates/
│   ├── control.html     # Control panel interface
│   └── display.html     # Transparent display overlay
├── pyproject.toml       # Python dependencies
└── replit.md            # This file
```

## Running the App
Default port is 5000. To change the port, set the `PORT` environment variable:
```bash
PORT=8080 python main.py
```

## Docker Deployment
To run in Docker:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install flask flask-socketio
EXPOSE 5000
CMD ["python", "main.py"]
```

## Usage
1. Open the control page at `http://localhost:5000/`
2. Open the display page at `http://localhost:5000/display` in OBS as a browser source
3. Configure the Lower Third text, position, and size
4. Click "Show Lower Third" to display it

## Technical Notes
- Uses Flask with Flask-SocketIO for real-time updates
- WebSocket communication between control and display pages
- Display page has transparent background for overlay use
