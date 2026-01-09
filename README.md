# Overlay Control App

A Docker-ready HTML5 overlay control application for streaming/broadcasting. Provides a web-based control panel and transparent display page for OBS browser source.

## Features

- **Lower Third** - Name/title display with image support, 8 style presets, custom colors, compact or full-width modes
- **RSS Ticker** - Scrolling news ticker from any RSS feed
- **Logo Bug** - Corner logo with opacity and size controls
- **Full-Screen Title Card** - Segment transitions with background image support
- **Social Media Bar** - Display social handles with platform icons
- **Breaking News Banner** - Urgent announcements with pulsing animation

All elements support:
- Font customization (11 built-in fonts + custom font URL)
- Position controls
- Size options
- Independent show/hide

## Quick Start

### Run Locally
```bash
python main.py
```
Default port is 5000. To change:
```bash
PORT=8080 python main.py
```

### Docker
```bash
docker build -t overlay-app .
docker run -p 5000:5000 overlay-app
```

## Usage

1. Open the **Control Panel**: `http://localhost:5000/`
2. Open the **Display Page**: `http://localhost:5000/display`
3. In OBS, add a Browser Source pointing to the display URL
4. Use the control panel to show/hide overlay elements

## HTTP API (GET Requests)

Control overlays remotely via HTTP GET requests. Perfect for Stream Deck, Companion, Touch Portal, or automation scripts.

### Lower Third
| Endpoint | Description |
|----------|-------------|
| `/api/lowerthird/show` | Show lower third |
| `/api/lowerthird/hide` | Hide lower third |
| `/api/lowerthird/update` | Update settings without showing |

Query parameters for `/show` and `/update`:
- `line1` - Name text
- `line2` - Title text
- `imageUrl` - Image URL (logo, headshot)
- `imageShape` - square, circle, rounded
- `position` - bottom-left, bottom-center, bottom-right, top-left, top-center, top-right
- `textSize` - small, medium, large, xlarge
- `width` - compact, full
- `style` - modern, classic, minimal, bold, news, elegant, neon, glass
- `bgColor` - Background color (hex)
- `accentColor` - Accent color (hex)
- `textColor` - Text color (hex)
- `font` - Font family name (or "custom" for custom font)
- `customFontUrl` - URL to custom font file (.ttf, .otf, .woff, .woff2)
- `customFontName` - Name for the custom font
- `duration` - Auto-hide seconds (0 = manual)

**Example:**
```
/api/lowerthird/show?line1=Jane%20Doe&line2=CEO&style=news&width=full
```

### RSS Ticker
| Endpoint | Description |
|----------|-------------|
| `/api/ticker/show` | Show ticker |
| `/api/ticker/hide` | Hide ticker |

### Logo Bug
| Endpoint | Description |
|----------|-------------|
| `/api/logo/show` | Show logo (optional: `?imageUrl=...`) |
| `/api/logo/hide` | Hide logo |

### Title Card
| Endpoint | Description |
|----------|-------------|
| `/api/titlecard/show` | Show title card (optional: `?title=...&subtitle=...`) |
| `/api/titlecard/hide` | Hide title card |

### Social Bar
| Endpoint | Description |
|----------|-------------|
| `/api/social/show` | Show social bar |
| `/api/social/hide` | Hide social bar |

### Breaking News
| Endpoint | Description |
|----------|-------------|
| `/api/breaking/show` | Show breaking news (optional: `?text=...`) |
| `/api/breaking/hide` | Hide breaking news |

### Global Controls
| Endpoint | Description |
|----------|-------------|
| `/api/all/hide` | Hide all overlay elements |

## Lower Third Options

### Style Presets

| Style | Description |
|-------|-------------|
| Modern | Gradient background with left accent bar |
| Classic | Solid color with thick left border |
| Minimal | Clean look with bottom accent line |
| Bold | Full solid background, no border |
| News | TV news bar style with side strip |
| Elegant | Thin border outline with blur backdrop |
| Neon | Glowing border effect |
| Glass | Frosted glass/transparent look |

### Width Modes

| Mode | Description |
|------|-------------|
| Compact | Fits content width, positioned based on selection |
| Full | Spans entire screen width, slides up/down |

### Custom Fonts

To use a custom font:
1. Select "Custom Font (URL below)" from the Font dropdown
2. Enter the direct URL to a font file (.ttf, .otf, .woff, .woff2)
3. Enter a name for the font
4. Click Update Settings

**Font hosting options:**
- Google Fonts (download and host)
- Font Squirrel (fontsquirrel.com)
- DaFont (dafont.com)
- Any direct file URL

### Image Support

Add a logo or headshot to the lower third:
- Paste an image URL
- Choose shape: Square, Circle, or Rounded
- Image scales automatically with text size

**Note:** Google Drive share links don't work directly. Convert them to:
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

## Project Structure

```
.
├── main.py              # Flask server with SocketIO
├── templates/
│   ├── control.html     # Control panel interface
│   └── display.html     # Transparent display overlay
├── Dockerfile           # Docker configuration
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## Requirements

- Python 3.11+
- Flask
- Flask-SocketIO
- feedparser

## OBS Setup

1. Add a new **Browser Source**
2. Set URL to `http://localhost:5000/display`
3. Set width/height to match your canvas (e.g., 1920x1080)
4. Check "Shutdown source when not visible" (optional)
5. The display has a transparent background - overlays will appear over your content
