from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import feedparser
import threading
import time
import os
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'lower-third-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

lower_third_state = {
    'line1': 'John Smith',
    'line2': 'Software Engineer',
    'position': 'bottom-left',
    'textSize': 'medium',
    'duration': 5,
    'visible': False
}

ticker_state = {
    'feedUrl': '',
    'items': [],
    'position': 'bottom',
    'textSize': 'medium',
    'speed': 'medium',
    'visible': False,
    'lastFetch': None
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
    return render_template('control.html')

@app.route('/display')
def display():
    return render_template('display.html')

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

@socketio.on('connect')
def handle_connect():
    emit('state_update', lower_third_state)
    emit('ticker_update', ticker_state)

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True, allow_unsafe_werkzeug=True)
