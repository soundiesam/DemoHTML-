# Overlay Control App

## Overview
An HTML5 application for creating and controlling streaming overlays, designed for broadcasting use. Can run on localhost with configurable port and is ready for Docker deployment.

## Pages
- **Control Page** (`/`): Web interface to manage overlay elements
- **Display Page** (`/display`): Transparent background overlay for OBS/streaming software
- **Multiview Page** (`/multiview`): 2x2 grid display with selectable elements per quadrant

## Features

### Lower Third Controls
- Two lines of text (name + title)
- Image support (logo/headshot) with square, circle, rounded shapes
- Position options: bottom-left, bottom-center, bottom-right, top-left, top-center, top-right
- Width modes: compact (fit content) or full (screen width)
- Text sizes: small, medium, large, extra large
- 8 style presets: modern, classic, minimal, bold, news, elegant, neon, glass
- Custom colors: background, accent, text
- 11 built-in fonts + custom font URL support
- Auto-hide duration (0 = manual control)
- Show/Hide buttons

### RSS Ticker Controls
- RSS feed URL input with load button
- Position options: top, bottom
- Text sizes: small, medium, large
- Speed control: slow, medium, fast
- Show/Hide buttons
- Scrolling ticker animation with feed headlines

### Logo Bug
- Image URL input for logo
- Position options: top-left, top-right, bottom-left, bottom-right
- Size options: small, medium, large
- Opacity slider (10-100%)
- Show/Hide buttons

### Full-Screen Title Card
- Title and subtitle text fields
- Background color picker and background image URL
- Text color picker
- Font selection
- Show/Hide buttons

### Social Media Bar
- Fields for Twitter/X, YouTube, Instagram, TikTok, Facebook, Website
- Position options: top, bottom
- Platform icons with handles
- Show/Hide buttons

### Breaking News Banner
- Custom text input
- Urgent red styling with pulsing animation
- Show/Hide buttons

### Multiview Display
- 2x2 grid layout with 4 quadrants
- Each quadrant has a dropdown to select which element to display
- Options: All Elements, Lower Third, RSS Ticker, Logo Bug, Title Card, Social Bar, Breaking News, None
- Selections persist via localStorage
- Color-coded borders for each quadrant

## HTTP API (GET Requests)
All elements can be controlled via HTTP GET requests for integration with Stream Deck, Companion, Touch Portal, or automation scripts. Endpoints include `/api/lowerthird/show`, `/api/lowerthird/hide`, `/api/ticker/show`, etc. See README.md for full API reference.

## Project Structure
```
.
├── main.py              # Flask server with SocketIO
├── templates/
│   ├── control.html     # Control panel interface
│   ├── display.html     # Transparent display overlay
│   └── multiview.html   # 2x2 grid multiview display
├── Dockerfile           # Docker configuration
├── requirements.txt     # Python dependencies
├── README.md            # Full documentation
└── replit.md            # This file
```

## Running the App
Default port is 5000. To change the port, set the `PORT` environment variable:
```bash
PORT=8080 python main.py
```

## Technical Notes
- Uses Flask with Flask-SocketIO for real-time updates
- WebSocket communication between control and display pages
- Display page has transparent background for overlay use
- Display page supports `?filter=` query param to show only one element type
- Multiview uses iframes with filter params for per-quadrant element selection
