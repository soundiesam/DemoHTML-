from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import os

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

@socketio.on('connect')
def handle_connect():
    emit('state_update', lower_third_state)

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True, allow_unsafe_werkzeug=True)
