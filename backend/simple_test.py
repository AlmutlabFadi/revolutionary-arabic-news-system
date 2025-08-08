#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': '✅ الخادم يعمل بنجاح!', 'status': 'active'})

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'الخادم يعمل'})

if __name__ == '__main__':
    print("🚀 بدء تشغيل الخادم البسيط...")
    app.run(host='0.0.0.0', port=5000, debug=True)
