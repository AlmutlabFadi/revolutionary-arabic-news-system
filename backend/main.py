from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': '🚀 جولان 24 يعمل!',
        'status': 'running',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'النظام يعمل'
    })

if __name__ == '__main__':
    print("🚀 تشغيل الخادم...")
    app.run(host='127.0.0.1', port=5000, debug=False)
