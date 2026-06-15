# Overlay Control App

A Docker-ready HTML5 overlay control application for streaming and broadcasting. Provides a web-based control panel and a transparent display page for use as an OBS browser source.

## Features

- **Lower Third** — Name/title display with image support, 8 style presets, custom colors, compact or full-width modes, XML import, and rundown queue
- **RSS Ticker** — Scrolling news ticker from any RSS feed
- **Logo Bug** — Corner logo with opacity and size controls
- **Full-Screen Title Card** — Segment transitions with background image support
- **Social Media Bar** — Display social handles with platform icons, XML import
- **Breaking News Banner** — Urgent announcements with pulsing animation
- **Multiview Display** — 2x2 grid with per-quadrant element selection

All elements support font customization (11 built-in fonts + custom font URL), position controls, size options, and independent show/hide.

---

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Control Panel | `/` | Web interface to manage all overlay elements |
| Display | `/display` | Transparent overlay for OBS browser source |
| Multiview | `/multiview` | 2x2 grid showing selected elements per quadrant |

---

## Quick Start

### Run Locally
```bash
pip install -r requirements.txt
python main.py
```
Default port is 5000. To change:
```bash
PORT=8080 python main.py
```
You can also change the port from the Settings (⚙) button in the control panel.

### Docker
```bash
docker build -t overlay-app .
docker run -p 5000:5000 overlay-app
```
To use a different port in Docker:
```bash
docker run -p 8080:8080 -e PORT=8080 overlay-app
```

---

## OBS Setup

1. Add a new **Browser Source**
2. Set URL to `http://localhost:5000/display`
3. Set width/height to match your canvas (e.g., 1920×1080)
4. Enable **Shutdown source when not visible** (optional)
5. The display page has a transparent background — overlays appear on top of your content

For the multiview monitor, point a second Browser Source at `http://localhost:5000/multiview`.

---

## Control Panel Layout

The control panel uses a **hybrid layout**:

- **Command strip** (top) — colour-coded Show/Hide buttons for every element, always visible regardless of which section is open
- **Sidebar** (left) — click any section to switch its settings into the main panel; an ON/OFF badge reflects live visibility state
- **Update button** (bottom-left) — pushes the current section's settings live

---

## XML Import

Both the **Lower Third** and **Social Media Bar** panels include an **Import from XML** section. Expand it to paste XML directly or load a `.xml` file from disk, then click **Apply to Form**. Fields not present in the XML are left unchanged. After applying, click the **Update** button to push live.

### Single Lower Third entry

```xml
<lowerthird>
  <line1>Jane Doe</line1>
  <line2>Lead Anchor</line2>
  <position>bottom-left</position>   <!-- bottom-left | bottom-center | bottom-right | top-* -->
  <style>modern</style>              <!-- modern | classic | minimal | bold | news | elegant | neon | glass -->
  <width>compact</width>             <!-- compact | full -->
  <textSize>medium</textSize>        <!-- small | medium | large | xlarge -->
  <font>Segoe UI</font>
  <duration>0</duration>             <!-- seconds; 0 = manual -->
  <imageUrl>https://example.com/photo.jpg</imageUrl>
  <imageShape>circle</imageShape>    <!-- square | circle | rounded -->
  <bgColor>#1a1a2e</bgColor>
  <accentColor>#00d4ff</accentColor>
  <textColor>#ffffff</textColor>
</lowerthird>
```

### Social Media Bar entry

```xml
<social>
  <twitter>@handle</twitter>
  <youtube>@channel</youtube>
  <instagram>@handle</instagram>
  <tiktok>@handle</tiktok>
  <facebook>pagename</facebook>
  <website>example.com</website>
  <position>bottom</position>        <!-- top | bottom -->
  <font>Segoe UI</font>
</social>
```

---

## Lower Third Rundown

Import a **series of lower thirds** from one XML file. Wrap multiple `<lowerthird>` elements in a `<rundown>` root:

```xml
<rundown>
  <lowerthird>
    <line1>Jane Doe</line1>
    <line2>Lead Anchor</line2>
    <style>modern</style>
  </lowerthird>
  <lowerthird>
    <line1>Bob Smith</line1>
    <line2>Sports Reporter</line2>
    <style>news</style>
    <bgColor>#1a0a0a</bgColor>
    <accentColor>#e94560</accentColor>
  </lowerthird>
  <lowerthird>
    <line1>Maria Chen</line1>
    <line2>Weather Correspondent</line2>
    <imageUrl>https://example.com/maria.jpg</imageUrl>
    <imageShape>circle</imageShape>
    <style>elegant</style>
  </lowerthird>
</rundown>
```

When multiple entries are detected, a **Rundown panel** appears between the import card and the form:

- Scrollable list of all entries showing name and title
- Click any row to load it into the form
- ↑ / ↓ buttons to step through one by one
- Counter showing current position (e.g. **2 / 8**)
- After selecting an entry, click **Update Lower Third** to push it live

An **Example .xml** button in the import card downloads a ready-to-edit sample rundown file with a full field reference in the comments.

---

## HTTP API

Control all overlays remotely via HTTP GET requests. Compatible with **Stream Deck**, **Bitfocus Companion**, **Touch Portal**, or any HTTP-capable automation tool.

### Lower Third

| Endpoint | Description |
|----------|-------------|
| `/api/lowerthird/show` | Show lower third |
| `/api/lowerthird/hide` | Hide lower third |
| `/api/lowerthird/update` | Update settings without showing |

Query parameters for `/show` and `/update`:
`line1`, `line2`, `imageUrl`, `imageShape`, `position`, `textSize`, `width`, `style`, `bgColor`, `accentColor`, `textColor`, `font`, `customFontUrl`, `customFontName`, `duration`

```
/api/lowerthird/show?line1=Jane%20Doe&line2=CEO&style=news&width=full
```

### Lower Third Rundown

Load a rundown via the control panel first (Import from XML), then drive it remotely:

| Endpoint | Description |
|----------|-------------|
| `/api/rundown/next` | Advance to next entry, apply it, show lower third |
| `/api/rundown/prev` | Go back one entry, apply it, show lower third |
| `/api/rundown/goto/3` | Jump to entry #3 (1-based), apply it, show lower third |
| `/api/rundown/show` | Re-show the current entry without advancing |
| `/api/rundown/hide` | Hide lower third, keep position in rundown |
| `/api/rundown/status` | Return current index, total, entry fields, has_next/has_prev |
| `/api/rundown/clear` | Clear the server-side rundown |

`/api/rundown/status` response:
```json
{
  "loaded": true,
  "total": 4,
  "current_index": 1,
  "current_number": 2,
  "has_next": true,
  "has_prev": true,
  "current_entry": { "line1": "Bob Smith", "line2": "Sports Reporter", ... }
}
```

When any rundown API call fires, a `rundown_update` WebSocket event is broadcast to all connected control pages so the rundown panel stays in sync automatically.

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

### Multiview

| Endpoint | Description |
|----------|-------------|
| `/api/multiview` | Get current quadrant assignments |
| `/api/multiview/set` | Set quadrant assignments (e.g., `?q1=lowerthird&q2=ticker`) |

Quadrant values: `all`, `lowerthird`, `ticker`, `logo`, `titlecard`, `social`, `breaking`, `none`

### Global Controls

| Endpoint | Description |
|----------|-------------|
| `/api/all/hide` | Hide all overlay elements at once |
| `/api/all_states` | Get visibility and settings for all elements |

### Configuration

| Endpoint | Description |
|----------|-------------|
| `/api/config` | Get current config (port) |
| `/api/config/port` | Set port (e.g., `?port=8080`) — requires restart |

---

## Lower Third Reference

### Style Presets

| Style | Description |
|-------|-------------|
| modern | Gradient background with left accent bar |
| classic | Solid colour with thick left border |
| minimal | Clean look with bottom accent line |
| bold | Full solid background, no border |
| news | TV news bar style with side strip |
| elegant | Thin border outline with blur backdrop |
| neon | Glowing border effect |
| glass | Frosted glass / transparent look |

### Width Modes

| Mode | Description |
|------|-------------|
| compact | Fits content width, positioned per selection |
| full | Spans the full screen width |

### Custom Fonts

1. Select **Custom Font (URL below)** from the Font dropdown
2. Paste a direct URL to a `.ttf`, `.otf`, `.woff`, or `.woff2` file
3. Enter a name for the font
4. Click **Update Lower Third**

Font sources: Google Fonts (download and self-host), Font Squirrel, DaFont, or any direct file URL.

### Image Support

- Paste an image URL into **Image URL**
- Choose shape: **Square**, **Circle**, or **Rounded**
- Image scales automatically with text size

> **Note:** Google Drive share links must be converted to direct download format:
> `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`

---

## Multiview Display

The multiview page splits the screen into a 2×2 grid. Each quadrant can independently display a different overlay element:

- All Elements
- Lower Third
- RSS Ticker
- Logo Bug
- Title Card
- Social Bar
- Breaking News
- None (blank)

Quadrant selections persist across page reloads via localStorage.

---

## Project Structure

```
.
├── main.py              # Flask server with SocketIO and all API routes
├── templates/
│   ├── control.html     # Control panel (hybrid command strip + sidebar layout)
│   ├── display.html     # Transparent display overlay (HTTP polling primary)
│   └── multiview.html   # 2×2 grid multiview display
├── Dockerfile           # Docker configuration
├── requirements.txt     # Python dependencies (Flask, Flask-SocketIO, feedparser, gevent)
├── config.json          # Port configuration (auto-generated on first port change)
└── README.md            # This file
```

---

## Requirements

- Python 3.11+
- Flask
- Flask-SocketIO
- feedparser
- gevent
- gevent-websocket
