#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
المرحلة الثالثة: النظام الثوري المتكامل
Phase Three: Revolutionary Integrated System
"""

import os
import sqlite3
import json
import logging
from datetime import datetime
from flask import Flask, render_template_string, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import threading
import time

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# إنشاء تطبيق Flask
app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

# تهيئة قاعدة البيانات
def init_phase_three_db():
    conn = sqlite3.connect('golan24_phase_three.db')
    cursor = conn.cursor()
    
    # جدول المقالات المتقدمة
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            summary TEXT,
            category TEXT,
            sentiment_score REAL,
            keywords TEXT,
            ai_processed BOOLEAN DEFAULT FALSE,
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            shares INTEGER DEFAULT 0,
            status TEXT DEFAULT 'published',
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reading_time INTEGER,
            difficulty_level TEXT,
            tags TEXT,
            featured BOOLEAN DEFAULT FALSE
        )
    ''')
    
    # إدراج بيانات تجريبية
    cursor.execute('SELECT COUNT(*) FROM articles')
    if cursor.fetchone()[0] == 0:
        sample_articles = [
            ('ثورة في عالم الذكاء الاصطناعي', 'محتوى المقال...', 'ملخص المقال', 'تكنولوجيا', 0.8, 'ذكاء اصطناعي,إعلام ذكي', True, 1250, 89, 45, 5, 'متوسط', 'تكنولوجيا,ذكاء اصطناعي', True),
            ('تحليل شامل: تأثير الذكاء الاصطناعي', 'محتوى المقال...', 'ملخص المقال', 'تحليل', 0.6, 'صحافة عربية,ذكاء اصطناعي', True, 890, 67, 23, 8, 'متقدم', 'تحليل,صحافة', False),
            ('نظام جولان 24 يحقق إنجازاً جديداً', 'محتوى المقال...', 'ملخص المقال', 'إنجازات', 0.9, 'إنجاز,معالجة محتوى', True, 2100, 156, 78, 3, 'سهل', 'إنجازات,تكنولوجيا', True)
        ]
        
        for article in sample_articles:
            cursor.execute('''
                INSERT INTO articles (title, content, summary, category, sentiment_score, 
                                   keywords, ai_processed, views, likes, shares, reading_time, 
                                   difficulty_level, tags, featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', article)
    
    conn.commit()
    conn.close()
    logger.info("✅ تم تهيئة قاعدة البيانات للمرحلة الثالثة")

# قالب HTML للمرحلة الثالثة
PHASE_THREE_HTML = '''
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>المرحلة الثالثة - النظام الثوري المتكامل</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .articles-section {
            margin-bottom: 30px;
        }
        .article-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 5px solid #667eea;
        }
        .article-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .api-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .api-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-decoration: none;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 المرحلة الثالثة: النظام الثوري المتكامل</h1>
            <p>آخر تحديث: {{ timestamp }}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{{ articles_count }}</div>
                <div>مقال منشور</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ total_views }}</div>
                <div>إجمالي المشاهدات</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ ai_processed }}</div>
                <div>مقال معالج بالذكاء الاصطناعي</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ average_sentiment }}</div>
                <div>متوسط المشاعر</div>
            </div>
        </div>
        
        <div class="articles-section">
            <h2>📰 أحدث المقالات</h2>
            {% for article in articles %}
            <div class="article-card">
                <div class="article-title">{{ article.title }}</div>
                <div>{{ article.summary }}</div>
                <div style="margin-top: 10px; color: #7f8c8d;">
                    <span>👁️ {{ article.views }} مشاهدة</span>
                    <span>👍 {{ article.likes }} إعجاب</span>
                    <span>🔄 {{ article.shares }} مشاركة</span>
                </div>
            </div>
            {% endfor %}
        </div>
        
        <div class="api-links">
            <a href="/api/health" class="api-link">🏥 حالة النظام</a>
            <a href="/api/articles" class="api-link">📰 جميع المقالات</a>
            <a href="/api/analytics" class="api-link">📊 التحليلات</a>
            <a href="/api/phase-three-status" class="api-link">🚀 حالة المرحلة الثالثة</a>
        </div>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
    <script>
        const socket = io();
        socket.on('connect', function() {
            console.log('✅ متصل بنجاح');
        });
    </script>
</body>
</html>
'''

@app.route('/')
def home():
    """الصفحة الرئيسية للمرحلة الثالثة"""
    try:
        conn = sqlite3.connect('golan24_phase_three.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM articles')
        articles_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(views) FROM articles')
        total_views = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT COUNT(*) FROM articles WHERE ai_processed = 1')
        ai_processed = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(sentiment_score) FROM articles WHERE sentiment_score IS NOT NULL')
        avg_sentiment = cursor.fetchone()[0] or 0.0
        
        cursor.execute('''
            SELECT title, summary, views, likes, shares
            FROM articles 
            ORDER BY published_at DESC 
            LIMIT 5
        ''')
        articles_data = cursor.fetchall()
        
        articles = []
        for article_data in articles_data:
            articles.append({
                'title': article_data[0],
                'summary': article_data[1],
                'views': article_data[2],
                'likes': article_data[3],
                'shares': article_data[4]
            })
        
        conn.close()
        
        return render_template_string(PHASE_THREE_HTML,
                                   articles=articles,
                                   articles_count=articles_count,
                                   total_views=total_views,
                                   ai_processed=ai_processed,
                                   average_sentiment=f"{avg_sentiment:.2f}",
                                   timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    except Exception as e:
        logger.error(f"خطأ في الصفحة الرئيسية: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    """فحص صحة النظام"""
    return jsonify({
        'status': 'healthy',
        'phase': 'الثالثة - النظام المتكامل',
        'timestamp': datetime.now().isoformat(),
        'version': '3.0.0'
    })

@app.route('/api/articles')
def get_articles():
    """الحصول على جميع المقالات"""
    try:
        conn = sqlite3.connect('golan24_phase_three.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM articles ORDER BY published_at DESC')
        articles = []
        for row in cursor.fetchall():
            articles.append({
                'id': row[0],
                'title': row[1],
                'summary': row[3],
                'category': row[4],
                'views': row[8],
                'likes': row[9],
                'shares': row[10]
            })
        conn.close()
        return jsonify({'articles': articles})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics')
def get_analytics():
    """الحصول على التحليلات"""
    try:
        conn = sqlite3.connect('golan24_phase_three.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM articles')
        total_articles = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(views) FROM articles')
        total_views = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT COUNT(*) FROM articles WHERE ai_processed = 1')
        ai_processed = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'total_articles': total_articles,
            'total_views': total_views,
            'ai_processed': ai_processed,
            'phase': 'الثالثة'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/phase-three-status')
def phase_three_status():
    """حالة المرحلة الثالثة"""
    return jsonify({
        'phase': 'الثالثة',
        'status': 'نشط',
        'features': [
            'نظام متكامل متقدم',
            'واجهة API محسنة',
            'تحليلات شاملة',
            'WebSocket للتحديثات الفورية',
            'قاعدة بيانات متقدمة'
        ],
        'timestamp': datetime.now().isoformat()
    })

@socketio.on('connect')
def handle_connect():
    emit('connected', {'status': 'connected'})

if __name__ == '__main__':
    init_phase_three_db()
    logger.info("🚀 بدء تشغيل المرحلة الثالثة: النظام الثوري المتكامل")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
