from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import feedparser
import time
import os
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'lower-third-secret'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')

lower_third_state = {
    'line1': 'John Smith',
    'line2': 'Software Engineer',
    'position': 'bottom-left',
    'textSize': 'medium',
    'font': 'Segoe UI',
    'customFontUrl': '',
    'customFontName': '',
    'duration': 5,
    'style': 'modern',
    'width': 'compact',
    'bgColor': '#1a1a2e',
    'accentColor': '#00d4ff',
    'textColor': '#ffffff',
    'imageUrl': '',
    'imageShape': 'square',
    'visible': False
}

ticker_state = {
    'feedUrl': '',
    'items': [],
    'position': 'bottom',
    'textSize': 'medium',
    'speed': 'medium',
    'font': 'Segoe UI',
    'visible': False,
    'lastFetch': None
}

logo_state = {
    'imageUrl': '',
    'position': 'top-right',
    'size': 'medium',
    'opacity': 100,
    'visible': False
}

title_card_state = {
    'title': 'Welcome',
    'subtitle': '',
    'backgroundColor': '#000000',
    'textColor': '#ffffff',
    'backgroundImage': '',
    'font': 'Segoe UI',
    'visible': False
}

social_bar_state = {
    'twitter': '',
    'youtube': '',
    'instagram': '',
    'facebook': '',
    'tiktok': '',
    'website': '',
    'position': 'bottom',
    'font': 'Segoe UI',
    'visible': False
}

breaking_news_state = {
    'text': 'BREAKING NEWS',
    'font': 'Segoe UI',
    'visible': False
}

multiview_state = {
    'q1': 'all',
    'q2': 'all',
    'q3': 'all',
    'q4': 'all'
}

rundown_state = {
    'entries': [],        # list of lower-third field dicts
    'current_index': -1,  # -1 = nothing loaded/selected
    'loaded': False
}

RUNDOWN_FIELDS = [
    'line1', 'line2', 'imageUrl', 'imageShape', 'position', 'style',
    'width', 'textSize', 'font', 'duration', 'customFontUrl',
    'customFontName', 'bgColor', 'accentColor', 'textColor'
]

def apply_rundown_entry(entry):
    """Merge a rundown entry dict into lower_third_state (skip None/missing fields)."""
    global lower_third_state
    for field in RUNDOWN_FIELDS:
        val = entry.get(field)
        if val is not None and val != '':
            if field == 'duration':
                try:
                    lower_third_state[field] = int(val)
                except (ValueError, TypeError):
                    pass
            else:
                lower_third_state[field] = val

def _rundown_status():
    idx = rundown_state['current_index']
    total = len(rundown_state['entries'])
    return {
        'loaded': rundown_state['loaded'],
        'total': total,
        'current_index': idx,
        'current_number': idx + 1 if idx >= 0 else 0,
        'current_entry': rundown_state['entries'][idx] if 0 <= idx < total else None,
        'has_next': idx < total - 1,
        'has_prev': idx > 0,
    }

def strip_html(text):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def fetch_rss_feed(url):
    try:
        if not url or not url.startswith(('http://', 'https://')):
            return []
        feed = feedparser.parse(url)
        items = []
        for entry in feed.entries[:20]:
            title = strip_html(entry.get('title', ''))
            if title:
                items.append(title)
        return items
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return []

@app.route('/')
def control():
    port = int(os.environ.get('PORT', 5000))
    return render_template('control.html', port=port)

@app.route('/display')
def display():
    return render_template('display.html')

@app.route('/multiview')
def multiview():
    return render_template('multiview.html')

@app.route('/api/state', methods=['GET'])
def get_state():
    return jsonify(lower_third_state)

@app.route('/api/state', methods=['POST'])
def update_state():
    global lower_third_state
    data = request.json
    lower_third_state.update(data)
    socketio.emit('state_update', lower_third_state)
    return jsonify(lower_third_state)

@app.route('/api/ticker', methods=['GET'])
def get_ticker():
    return jsonify(ticker_state)

@app.route('/api/ticker', methods=['POST'])
def update_ticker():
    global ticker_state
    data = request.json
    
    if 'feedUrl' in data and data['feedUrl'] != ticker_state.get('feedUrl'):
        items = fetch_rss_feed(data['feedUrl'])
        data['items'] = items
        data['lastFetch'] = time.time()
    
    ticker_state.update(data)
    socketio.emit('ticker_update', ticker_state)
    return jsonify(ticker_state)

@app.route('/api/ticker/refresh', methods=['POST'])
def refresh_ticker():
    global ticker_state
    items = fetch_rss_feed(ticker_state.get('feedUrl', ''))
    ticker_state['items'] = items
    ticker_state['lastFetch'] = time.time()
    socketio.emit('ticker_update', ticker_state)
    return jsonify(ticker_state)

@app.route('/api/logo', methods=['POST'])
def update_logo():
    global logo_state
    data = request.json
    logo_state.update(data)
    socketio.emit('logo_update', logo_state)
    return jsonify(logo_state)

@app.route('/api/titlecard', methods=['POST'])
def update_title_card():
    global title_card_state
    data = request.json
    title_card_state.update(data)
    socketio.emit('titlecard_update', title_card_state)
    return jsonify(title_card_state)

@app.route('/api/social', methods=['POST'])
def update_social():
    global social_bar_state
    data = request.json
    social_bar_state.update(data)
    socketio.emit('social_update', social_bar_state)
    return jsonify(social_bar_state)

@app.route('/api/breaking', methods=['POST'])
def update_breaking():
    global breaking_news_state
    data = request.json
    breaking_news_state.update(data)
    socketio.emit('breaking_update', breaking_news_state)
    return jsonify(breaking_news_state)

@socketio.on('connect')
def handle_connect():
    emit('state_update', lower_third_state)
    emit('ticker_update', ticker_state)
    emit('logo_update', logo_state)
    emit('titlecard_update', title_card_state)
    emit('social_update', social_bar_state)
    emit('breaking_update', breaking_news_state)
    emit('multiview_update', multiview_state)
    emit('rundown_update', _rundown_status())

@socketio.on('show')
def handle_show():
    global lower_third_state
    lower_third_state['visible'] = True
    emit('state_update', lower_third_state, broadcast=True)

@socketio.on('hide')
def handle_hide():
    global lower_third_state
    lower_third_state['visible'] = False
    emit('state_update', lower_third_state, broadcast=True)

@socketio.on('ticker_show')
def handle_ticker_show():
    global ticker_state
    ticker_state['visible'] = True
    emit('ticker_update', ticker_state, broadcast=True)

@socketio.on('ticker_hide')
def handle_ticker_hide():
    global ticker_state
    ticker_state['visible'] = False
    emit('ticker_update', ticker_state, broadcast=True)

@socketio.on('logo_show')
def handle_logo_show():
    global logo_state
    logo_state['visible'] = True
    emit('logo_update', logo_state, broadcast=True)

@socketio.on('logo_hide')
def handle_logo_hide():
    global logo_state
    logo_state['visible'] = False
    emit('logo_update', logo_state, broadcast=True)

@socketio.on('titlecard_show')
def handle_titlecard_show():
    global title_card_state
    title_card_state['visible'] = True
    emit('titlecard_update', title_card_state, broadcast=True)

@socketio.on('titlecard_hide')
def handle_titlecard_hide():
    global title_card_state
    title_card_state['visible'] = False
    emit('titlecard_update', title_card_state, broadcast=True)

@socketio.on('social_show')
def handle_social_show():
    global social_bar_state
    social_bar_state['visible'] = True
    emit('social_update', social_bar_state, broadcast=True)

@socketio.on('social_hide')
def handle_social_hide():
    global social_bar_state
    social_bar_state['visible'] = False
    emit('social_update', social_bar_state, broadcast=True)

@socketio.on('breaking_show')
def handle_breaking_show():
    global breaking_news_state
    breaking_news_state['visible'] = True
    emit('breaking_update', breaking_news_state, broadcast=True)

@socketio.on('breaking_hide')
def handle_breaking_hide():
    global breaking_news_state
    breaking_news_state['visible'] = False
    emit('breaking_update', breaking_news_state, broadcast=True)

@socketio.on('multiview_set')
def handle_multiview_set(data):
    global multiview_state
    multiview_state.update(data)
    emit('multiview_update', multiview_state, broadcast=True)

# HTTP GET endpoints for remote control
@app.route('/api/lowerthird/show')
def http_lt_show():
    global lower_third_state
    # Allow setting text via query params
    if request.args.get('line1'):
        lower_third_state['line1'] = request.args.get('line1')
    if request.args.get('line2'):
        lower_third_state['line2'] = request.args.get('line2')
    if request.args.get('imageUrl'):
        lower_third_state['imageUrl'] = request.args.get('imageUrl')
    lower_third_state['visible'] = True
    socketio.emit('state_update', lower_third_state)
    return jsonify({'status': 'ok', 'visible': True})

@app.route('/api/lowerthird/hide')
def http_lt_hide():
    global lower_third_state
    lower_third_state['visible'] = False
    socketio.emit('state_update', lower_third_state)
    return jsonify({'status': 'ok', 'visible': False})

@app.route('/api/lowerthird/update')
def http_lt_update():
    global lower_third_state
    for key in ['line1', 'line2', 'position', 'textSize', 'font', 'customFontUrl', 'customFontName', 'style', 'width', 'bgColor', 'accentColor', 'textColor', 'imageUrl', 'imageShape']:
        if request.args.get(key):
            lower_third_state[key] = request.args.get(key)
    if request.args.get('duration'):
        lower_third_state['duration'] = int(request.args.get('duration'))
    socketio.emit('state_update', lower_third_state)
    return jsonify({'status': 'ok', 'state': lower_third_state})

@app.route('/api/ticker/show')
def http_ticker_show():
    global ticker_state
    ticker_state['visible'] = True
    socketio.emit('ticker_update', ticker_state)
    return jsonify({'status': 'ok', 'visible': True})

@app.route('/api/ticker/hide')
def http_ticker_hide():
    global ticker_state
    ticker_state['visible'] = False
    socketio.emit('ticker_update', ticker_state)
    return jsonify({'status': 'ok', 'visible': False})

@app.route('/api/logo/show')
def http_logo_show():
    global logo_state
    if request.args.get('imageUrl'):
        logo_state['imageUrl'] = request.args.get('imageUrl')
    logo_state['visible'] = True
    socketio.emit('logo_update', logo_state)
    return jsonify({'status': 'ok', 'visible': True})

@app.route('/api/logo/hide')
def http_logo_hide():
    global logo_state
    logo_state['visible'] = False
    socketio.emit('logo_update', logo_state)
    return jsonify({'status': 'ok', 'visible': False})

@app.route('/api/titlecard/show')
def http_titlecard_show():
    global title_card_state
    if request.args.get('title'):
        title_card_state['title'] = request.args.get('title')
    if request.args.get('subtitle'):
        title_card_state['subtitle'] = request.args.get('subtitle')
    title_card_state['visible'] = True
    socketio.emit('titlecard_update', title_card_state)
    return jsonify({'status': 'ok', 'visible': True})

@app.route('/api/titlecard/hide')
def http_titlecard_hide():
    global title_card_state
    title_card_state['visible'] = False
    socketio.emit('titlecard_update', title_card_state)
    return jsonify({'status': 'ok', 'visible': False})

@app.route('/api/social/show')
def http_social_show():
    global social_bar_state
    social_bar_state['visible'] = True
    socketio.emit('social_update', social_bar_state)
    return jsonify({'status': 'ok', 'visible': True})

@app.route('/api/social/hide')
def http_social_hide():
    global social_bar_state
    social_bar_state['visible'] = False
    socketio.emit('social_update', social_bar_state)
    return jsonify({'status': 'ok', 'visible': False})

@app.route('/api/breaking/show')
def http_breaking_show():
    global breaking_news_state
    if request.args.get('text'):
        breaking_news_state['text'] = request.args.get('text')
    breaking_news_state['visible'] = True
    socketio.emit('breaking_update', breaking_news_state)
    return jsonify({'status': 'ok', 'visible': True})

@app.route('/api/breaking/hide')
def http_breaking_hide():
    global breaking_news_state
    breaking_news_state['visible'] = False
    socketio.emit('breaking_update', breaking_news_state)
    return jsonify({'status': 'ok', 'visible': False})

@app.route('/api/all/hide')
def http_hide_all():
    global lower_third_state, ticker_state, logo_state, title_card_state, social_bar_state, breaking_news_state
    lower_third_state['visible'] = False
    ticker_state['visible'] = False
    logo_state['visible'] = False
    title_card_state['visible'] = False
    social_bar_state['visible'] = False
    breaking_news_state['visible'] = False
    socketio.emit('state_update', lower_third_state)
    socketio.emit('ticker_update', ticker_state)
    socketio.emit('logo_update', logo_state)
    socketio.emit('titlecard_update', title_card_state)
    socketio.emit('social_update', social_bar_state)
    socketio.emit('breaking_update', breaking_news_state)
    return jsonify({'status': 'ok', 'message': 'All elements hidden'})

# ── Rundown API ─────────────────────────────────────────────────────────────

@app.route('/api/rundown/load', methods=['POST'])
def rundown_load():
    """Load a rundown from a JSON array of entry objects sent by the control page."""
    global rundown_state
    data = request.json
    if not isinstance(data, list):
        return jsonify({'error': 'Expected a JSON array of entries'}), 400
    rundown_state['entries'] = data
    rundown_state['current_index'] = 0 if data else -1
    rundown_state['loaded'] = bool(data)
    socketio.emit('rundown_update', _rundown_status())
    return jsonify({'status': 'ok', **_rundown_status()})

@app.route('/api/rundown/status')
def rundown_status():
    return jsonify(_rundown_status())

@app.route('/api/rundown/next')
def rundown_next():
    global rundown_state, lower_third_state
    idx = rundown_state['current_index']
    total = len(rundown_state['entries'])
    if total == 0:
        return jsonify({'error': 'No rundown loaded'}), 400
    if idx >= total - 1:
        return jsonify({'error': 'Already at last entry', **_rundown_status()}), 400
    rundown_state['current_index'] = idx + 1
    apply_rundown_entry(rundown_state['entries'][rundown_state['current_index']])
    lower_third_state['visible'] = True
    socketio.emit('state_update', lower_third_state)
    socketio.emit('rundown_update', _rundown_status())
    return jsonify({'status': 'ok', **_rundown_status()})

@app.route('/api/rundown/prev')
def rundown_prev():
    global rundown_state, lower_third_state
    idx = rundown_state['current_index']
    total = len(rundown_state['entries'])
    if total == 0:
        return jsonify({'error': 'No rundown loaded'}), 400
    if idx <= 0:
        return jsonify({'error': 'Already at first entry', **_rundown_status()}), 400
    rundown_state['current_index'] = idx - 1
    apply_rundown_entry(rundown_state['entries'][rundown_state['current_index']])
    lower_third_state['visible'] = True
    socketio.emit('state_update', lower_third_state)
    socketio.emit('rundown_update', _rundown_status())
    return jsonify({'status': 'ok', **_rundown_status()})

@app.route('/api/rundown/goto/<int:n>')
def rundown_goto(n):
    """Go to entry by 1-based number (e.g. /api/rundown/goto/3 = third entry)."""
    global rundown_state, lower_third_state
    total = len(rundown_state['entries'])
    if total == 0:
        return jsonify({'error': 'No rundown loaded'}), 400
    idx = n - 1  # convert to 0-based
    if idx < 0 or idx >= total:
        return jsonify({'error': f'Entry {n} out of range (1–{total})'}), 400
    rundown_state['current_index'] = idx
    apply_rundown_entry(rundown_state['entries'][idx])
    lower_third_state['visible'] = True
    socketio.emit('state_update', lower_third_state)
    socketio.emit('rundown_update', _rundown_status())
    return jsonify({'status': 'ok', **_rundown_status()})

@app.route('/api/rundown/show')
def rundown_show():
    """Show the current rundown entry without advancing."""
    global rundown_state, lower_third_state
    idx = rundown_state['current_index']
    total = len(rundown_state['entries'])
    if total == 0 or idx < 0:
        return jsonify({'error': 'No rundown entry selected'}), 400
    apply_rundown_entry(rundown_state['entries'][idx])
    lower_third_state['visible'] = True
    socketio.emit('state_update', lower_third_state)
    socketio.emit('rundown_update', _rundown_status())
    return jsonify({'status': 'ok', **_rundown_status()})

@app.route('/api/rundown/hide')
def rundown_hide():
    """Hide the lower third without changing rundown position."""
    global lower_third_state
    lower_third_state['visible'] = False
    socketio.emit('state_update', lower_third_state)
    return jsonify({'status': 'ok', 'visible': False, **_rundown_status()})

@app.route('/api/rundown/clear')
def rundown_clear():
    global rundown_state
    rundown_state['entries'] = []
    rundown_state['current_index'] = -1
    rundown_state['loaded'] = False
    socketio.emit('rundown_update', _rundown_status())
    return jsonify({'status': 'ok', **_rundown_status()})

@app.route('/api/all_states', methods=['GET'])
def get_all_states():
    return jsonify({
        'lowerthird': lower_third_state,
        'ticker': ticker_state,
        'logo': logo_state,
        'titlecard': title_card_state,
        'social': social_bar_state,
        'breaking': breaking_news_state
    })

@app.route('/api/multiview', methods=['GET'])
def get_multiview():
    return jsonify(multiview_state)

@app.route('/api/multiview/set', methods=['GET'])
def set_multiview():
    global multiview_state
    for q in ['q1', 'q2', 'q3', 'q4']:
        val = request.args.get(q)
        if val:
            multiview_state[q] = val
    socketio.emit('multiview_update', multiview_state)
    return jsonify({'status': 'ok', 'state': multiview_state})

@app.route('/api/config', methods=['GET'])
def get_config():
    port = int(os.environ.get('PORT', 5000))
    return jsonify({'port': port})

@app.route('/api/config/port', methods=['GET'])
def set_port():
    new_port = request.args.get('port')
    if not new_port:
        return jsonify({'error': 'No port specified'}), 400
    try:
        port_num = int(new_port)
        if port_num < 1 or port_num > 65535:
            return jsonify({'error': 'Port must be between 1 and 65535'}), 400
        config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
        config = {}
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                import json
                config = json.load(f)
        config['port'] = port_num
        with open(config_path, 'w') as f:
            import json
            json.dump(config, f, indent=2)
        return jsonify({'status': 'ok', 'port': port_num, 'message': 'Port saved. Restart the app for changes to take effect.'})
    except ValueError:
        return jsonify({'error': 'Invalid port number'}), 400

if __name__ == '__main__':
    import json
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
    config_port = None
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                config_port = config.get('port')
        except:
            pass
    port = int(os.environ.get('PORT', config_port or 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True, allow_unsafe_werkzeug=True)
