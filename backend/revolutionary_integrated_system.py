#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
النظام الثوري المتكامل - المرحلة الثالثة
Revolutionary Integrated System - Phase Three
"""

import os
import sqlite3
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from flask import Flask, render_template_string, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import threading
import time
import hashlib
import secrets

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('revolutionary_system.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# إنشاء تطبيق Flask
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_TYPE'] = 'filesystem'

# إعداد CORS
CORS(app, origins="*", supports_credentials=True)

# إعداد SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# استيراد المكونات
try:
    from ai_engine import RevolutionaryAIEngine
    from automation_system import RevolutionaryAutomationSystem
    ai_engine = RevolutionaryAIEngine()
    automation_system = RevolutionaryAutomationSystem()
    logger.info("✅ تم تحميل محرك الذكاء الاصطناعي ونظام الأتمتة بنجاح")
except ImportError as e:
    logger.warning(f"⚠️ لم يتم تحميل بعض المكونات: {e}")
    ai_engine = None
    automation_system = None

# قاعدة البيانات المتقدمة
def init_revolutionary_database():
    """تهيئة قاعدة البيانات الثورية المتقدمة"""
    conn = sqlite3.connect('golan24_revolutionary_integrated.db')
    cursor = conn.cursor()
    
    # جدول المقالات المتقدم
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
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            source_url TEXT,
            author TEXT,
            reading_time INTEGER,
            difficulty_level TEXT,
            tags TEXT,
            featured BOOLEAN DEFAULT FALSE
        )
    ''')
    
    # جدول المصادر المتقدم
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            country TEXT,
            language TEXT DEFAULT 'ar',
            category TEXT,
            active BOOLEAN DEFAULT TRUE,
            last_scraped TIMESTAMP,
            reliability_score REAL DEFAULT 0.8,
            update_frequency INTEGER DEFAULT 3600,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # جدول التحليلات المتقدم
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            total_articles INTEGER DEFAULT 0,
            total_views INTEGER DEFAULT 0,
            total_likes INTEGER DEFAULT 0,
            total_shares INTEGER DEFAULT 0,
            ai_processed_articles INTEGER DEFAULT 0,
            average_sentiment REAL DEFAULT 0.0,
            top_categories TEXT,
            top_keywords TEXT,
            system_performance REAL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # جدول المستخدمين
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            permissions TEXT,
            last_login TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    ''')
    
    # جدول الجلسات
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            session_token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # إدراج بيانات تجريبية متقدمة
    cursor.execute('SELECT COUNT(*) FROM articles')
    if cursor.fetchone()[0] == 0:
        # إدراج مقالات تجريبية متقدمة
        sample_articles = [
            {
                'title': 'ثورة في عالم الذكاء الاصطناعي: نظام جولان 24 يغير قواعد اللعبة',
                'content': 'أعلن فريق تطوير نظام جولان 24 عن إطلاق المرحلة الثالثة من النظام الثوري المتكامل، والذي يمثل قفزة نوعية في عالم الإعلام الذكي...',
                'summary': 'نظام جولان 24 يطلق المرحلة الثالثة من التطوير مع ميزات ذكية متقدمة',
                'category': 'تكنولوجيا',
                'sentiment_score': 0.8,
                'keywords': 'ذكاء اصطناعي,إعلام ذكي,جولان 24,ثورة تكنولوجية',
                'ai_processed': True,
                'views': 1250,
                'likes': 89,
                'shares': 45,
                'reading_time': 5,
                'difficulty_level': 'متوسط',
                'tags': 'تكنولوجيا,ذكاء اصطناعي,إعلام',
                'featured': True
            },
            {
                'title': 'تحليل شامل: تأثير الذكاء الاصطناعي على مستقبل الصحافة العربية',
                'content': 'في عصر التحول الرقمي، أصبح الذكاء الاصطناعي محركاً أساسياً لتطوير الصحافة العربية...',
                'summary': 'دراسة شاملة حول دور الذكاء الاصطناعي في تطوير الصحافة العربية',
                'category': 'تحليل',
                'sentiment_score': 0.6,
                'keywords': 'صحافة عربية,ذكاء اصطناعي,تحليل,مستقبل',
                'ai_processed': True,
                'views': 890,
                'likes': 67,
                'shares': 23,
                'reading_time': 8,
                'difficulty_level': 'متقدم',
                'tags': 'تحليل,صحافة,ذكاء اصطناعي'
            },
            {
                'title': 'نظام جولان 24 يحقق إنجازاً جديداً: معالجة 1000 مقال في أقل من ساعة',
                'content': 'حقق نظام جولان 24 إنجازاً جديداً في مجال معالجة المحتوى الإعلامي...',
                'summary': 'إنجاز جديد لنظام جولان 24 في معالجة المحتوى الإعلامي',
                'category': 'إنجازات',
                'sentiment_score': 0.9,
                'keywords': 'إنجاز,معالجة محتوى,جولان 24,سرعة',
                'ai_processed': True,
                'views': 2100,
                'likes': 156,
                'shares': 78,
                'reading_time': 3,
                'difficulty_level': 'سهل',
                'tags': 'إنجازات,تكنولوجيا,سرعة'
            }
        ]
        
        for article in sample_articles:
            cursor.execute('''
                INSERT INTO articles (title, content, summary, category, sentiment_score, 
                                   keywords, ai_processed, views, likes, shares, reading_time, 
                                   difficulty_level, tags, featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                article['title'], article['content'], article['summary'], article['category'],
                article['sentiment_score'], article['keywords'], article['ai_processed'],
                article['views'], article['likes'], article['shares'], article['reading_time'],
                article['difficulty_level'], article['tags'], article['featured']
            ))
        
        # إدراج مصادر متقدمة
        sample_sources = [
            ('وكالة سانا', 'https://sana.sy/rss.xml', 'سوريا', 'ar', 'أخبار', True, 0.9),
            ('وكالة الأنباء الفلسطينية', 'https://www.wafa.ps/rss.xml', 'فلسطين', 'ar', 'أخبار', True, 0.85),
            ('وكالة الأنباء الأردنية', 'https://www.petra.gov.jo/rss.xml', 'الأردن', 'ar', 'أخبار', True, 0.8),
            ('وكالة الأنباء اللبنانية', 'https://nna-leb.gov.lb/rss.xml', 'لبنان', 'ar', 'أخبار', True, 0.8),
            ('وكالة الأنباء العراقية', 'https://www.ina.iq/rss.xml', 'العراق', 'ar', 'أخبار', True, 0.8)
        ]
        
        for source in sample_sources:
            cursor.execute('''
                INSERT INTO sources (name, url, country, language, category, active, reliability_score)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', source)
        
        # إدراج تحليلات تجريبية
        cursor.execute('''
            INSERT INTO analytics (date, total_articles, total_views, total_likes, total_shares, 
                                 ai_processed_articles, average_sentiment, top_categories, top_keywords)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            datetime.now().date(), 3, 4240, 312, 146, 3, 0.77,
            'تكنولوجيا,تحليل,إنجازات', 'ذكاء اصطناعي,صحافة عربية,إعلام ذكي'
        ))
        
        # إدراج مستخدم تجريبي
        admin_password_hash = hashlib.sha256('admin123'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, role, permissions)
            VALUES (?, ?, ?, ?, ?)
        ''', ('admin', 'admin@golan24.com', admin_password_hash, 'admin', 'all'))
    
    conn.commit()
    conn.close()
    logger.info("✅ تم تهيئة قاعدة البيانات الثورية المتكاملة بنجاح")

# قالب HTML متقدم للواجهة الأمامية
REVOLUTIONARY_INTEGRATED_HTML = '''
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام جولان 24 الثوري المتكامل</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 1.2em;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .status-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .status-card:hover {
            transform: translateY(-5px);
        }
        
        .status-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .ai-status {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .ai-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .ai-active {
            background: #27ae60;
        }
        
        .ai-inactive {
            background: #e74c3c;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .articles-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .articles-section h2 {
            color: #2c3e50;
            margin-bottom: 25px;
            font-size: 1.8em;
        }
        
        .article-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            border-left: 5px solid #667eea;
        }
        
        .article-card:hover {
            transform: translateX(-5px);
        }
        
        .article-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .article-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .article-meta {
            display: flex;
            gap: 15px;
            font-size: 0.9em;
            color: #7f8c8d;
            margin-bottom: 15px;
        }
        
        .sentiment-indicator {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
        }
        
        .sentiment-positive {
            background: #d4edda;
            color: #155724;
        }
        
        .sentiment-neutral {
            background: #fff3cd;
            color: #856404;
        }
        
        .sentiment-negative {
            background: #f8d7da;
            color: #721c24;
        }
        
        .article-summary {
            color: #555;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .article-stats {
            display: flex;
            gap: 20px;
            font-size: 0.9em;
            color: #7f8c8d;
        }
        
        .api-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .api-section h2 {
            color: #2c3e50;
            margin-bottom: 25px;
            font-size: 1.8em;
        }
        
        .api-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .api-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-decoration: none;
            text-align: center;
            transition: transform 0.3s ease;
            display: block;
        }
        
        .api-link:hover {
            transform: translateY(-3px);
            color: white;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .real-time-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(39, 174, 96, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 0.9em;
            z-index: 1000;
            animation: fadeInOut 3s infinite;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .status-grid {
                grid-template-columns: 1fr;
            }
            
            .article-header {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="real-time-indicator">
        🔴 تحديثات فورية مفعلة
    </div>
    
    <div class="container">
        <div class="header">
            <h1>🚀 نظام جولان 24 الثوري المتكامل</h1>
            <p>المرحلة الثالثة: النظام المتكامل المتقدم</p>
            <p>آخر تحديث: {{ timestamp }}</p>
        </div>
        
        <div class="status-grid">
            <div class="status-card">
                <h3>📊 إحصائيات شاملة</h3>
                <div class="stat-number">{{ articles_count }}</div>
                <div class="stat-label">مقال منشور</div>
            </div>
            
            <div class="status-card">
                <h3>👁️ إجمالي المشاهدات</h3>
                <div class="stat-number">{{ total_views }}</div>
                <div class="stat-label">مشاهدة</div>
            </div>
            
            <div class="status-card">
                <h3>🤖 معالجة الذكاء الاصطناعي</h3>
                <div class="stat-number">{{ ai_processed }}</div>
                <div class="stat-label">مقال معالج</div>
            </div>
            
            <div class="status-card">
                <h3>📈 متوسط المشاعر</h3>
                <div class="stat-number">{{ average_sentiment }}</div>
                <div class="stat-label">نقطة</div>
            </div>
            
            <div class="status-card">
                <h3>🔗 المصادر النشطة</h3>
                <div class="stat-number">{{ sources_count }}</div>
                <div class="stat-label">مصدر</div>
            </div>
            
            <div class="status-card">
                <h3>⚡ حالة النظام</h3>
                <div class="ai-status">
                    <div class="ai-indicator ai-active"></div>
                    <span>نشط ومتصل</span>
                </div>
            </div>
        </div>
        
        <div class="articles-section">
            <h2>📰 أحدث المقالات الثورية</h2>
            {% for article in articles %}
            <div class="article-card">
                <div class="article-header">
                    <div>
                        <div class="article-title">{{ article.title }}</div>
                        <div class="article-meta">
                            <span>📅 {{ article.published_at }}</span>
                            <span>📖 {{ article.reading_time }} دقائق</span>
                            <span>🏷️ {{ article.category }}</span>
                            {% if article.featured %}
                            <span>⭐ مميز</span>
                            {% endif %}
                        </div>
                    </div>
                    <div class="sentiment-indicator sentiment-{{ article.sentiment_class }}">
                        {{ article.sentiment_text }}
                    </div>
                </div>
                <div class="article-summary">{{ article.summary }}</div>
                <div class="article-stats">
                    <span>👁️ {{ article.views }} مشاهدة</span>
                    <span>👍 {{ article.likes }} إعجاب</span>
                    <span>🔄 {{ article.shares }} مشاركة</span>
                    <span>🔑 {{ article.keywords }}</span>
                </div>
            </div>
            {% endfor %}
        </div>
        
        <div class="api-section">
            <h2>🔌 واجهات API المتقدمة</h2>
            <div class="api-links">
                <a href="/api/health" class="api-link">🏥 حالة النظام</a>
                <a href="/api/articles" class="api-link">📰 جميع المقالات</a>
                <a href="/api/analytics" class="api-link">📊 التحليلات المتقدمة</a>
                <a href="/api/ai-status" class="api-link">🤖 حالة الذكاء الاصطناعي</a>
                <a href="/api/sources" class="api-link">🔗 المصادر النشطة</a>
                <a href="/api/automation" class="api-link">⚙️ حالة الأتمتة</a>
            </div>
        </div>
        
        <div class="footer">
            <p>🚀 نظام جولان 24 الثوري المتكامل - المرحلة الثالثة</p>
            <p>تم التطوير باستخدام أحدث تقنيات الذكاء الاصطناعي</p>
        </div>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
    <script>
        // اتصال WebSocket للتحديثات الفورية
        const socket = io();
        
        socket.on('connect', function() {
            console.log('✅ متصل بنجاح مع الخادم');
        });
        
        socket.on('article_published', function(data) {
            console.log('📰 مقال جديد:', data);
            // تحديث الواجهة فورياً
            location.reload();
        });
        
        socket.on('ai_processed', function(data) {
            console.log('🤖 معالجة ذكاء اصطناعي:', data);
        });
        
        socket.on('automation_update', function(data) {
            console.log('⚙️ تحديث أتمتة:', data);
        });
        
        // تحديث فوري كل 30 ثانية
        setInterval(function() {
            fetch('/api/health')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'healthy') {
                        console.log('✅ النظام يعمل بشكل طبيعي');
                    }
                })
                .catch(error => {
                    console.error('❌ خطأ في الاتصال:', error);
                });
        }, 30000);
    </script>
</body>
</html>
'''

# المسارات الرئيسية
@app.route('/')
def home():
    """الصفحة الرئيسية للنظام الثوري المتكامل"""
    try:
        conn = sqlite3.connect('golan24_revolutionary_integrated.db')
        cursor = conn.cursor()
        
        # إحصائيات شاملة
        cursor.execute('SELECT COUNT(*) FROM articles')
        articles_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(views) FROM articles')
        total_views = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT COUNT(*) FROM articles WHERE ai_processed = 1')
        ai_processed = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(sentiment_score) FROM articles WHERE sentiment_score IS NOT NULL')
        avg_sentiment = cursor.fetchone()[0] or 0.0
        
        cursor.execute('SELECT COUNT(*) FROM sources WHERE active = 1')
        sources_count = cursor.fetchone()[0]
        
        # أحدث المقالات مع تحليل المشاعر
        cursor.execute('''
            SELECT title, summary, category, sentiment_score, views, likes, shares, 
                   published_at, reading_time, featured, keywords
            FROM articles 
            ORDER BY published_at DESC 
            LIMIT 5
        ''')
        articles_data = cursor.fetchall()
        
        articles = []
        for article_data in articles_data:
            sentiment_score = article_data[3] or 0.0
            if sentiment_score > 0.6:
                sentiment_class = 'positive'
                sentiment_text = 'إيجابي'
            elif sentiment_score < 0.4:
                sentiment_class = 'negative'
                sentiment_text = 'سلبي'
            else:
                sentiment_class = 'neutral'
                sentiment_text = 'محايد'
            
            articles.append({
                'title': article_data[0],
                'summary': article_data[1],
                'category': article_data[2],
                'sentiment_score': sentiment_score,
                'views': article_data[4],
                'likes': article_data[5],
                'shares': article_data[6],
                'published_at': article_data[7],
                'reading_time': article_data[8],
                'featured': article_data[9],
                'keywords': article_data[10],
                'sentiment_class': sentiment_class,
                'sentiment_text': sentiment_text
            })
        
        conn.close()
        
        return render_template_string(REVOLUTIONARY_INTEGRATED_HTML,
                                   articles=articles,
                                   articles_count=articles_count,
                                   total_views=total_views,
                                   ai_processed=ai_processed,
                                   average_sentiment=f"{avg_sentiment:.2f}",
                                   sources_count=sources_count,
                                   timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    except Exception as e:
        logger.error(f"خطأ في الصفحة الرئيسية: {e}")
        return jsonify({'error': str(e)}), 500

# واجهات API المتقدمة
@app.route('/api/health')
def health_check():
    """فحص صحة النظام"""
    try:
        conn = sqlite3.connect('golan24_revolutionary_integrated.db')
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM articles')
        articles_count = cursor.fetchone()[0]
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '3.0.0',
            'phase': 'الثالثة - النظام المتكامل',
            'articles_count': articles_count,
            'ai_engine_available': ai_engine is not None,
            'automation_available': automation_system is not None,
            'database': 'connected',
            'websocket': 'active'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/api/articles')
def get_articles():
    """الحصول على جميع المقالات"""
    try:
        conn = sqlite3.connect('golan24_revolutionary_integrated.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, summary, category, sentiment_score, views, likes, shares,
                   published_at, reading_time, featured, keywords, ai_processed
            FROM articles 
            ORDER BY published_at DESC
        ''')
        
        articles = []
        for row in cursor.fetchall():
            articles.append({
                'id': row[0],
                'title': row[1],
                'summary': row[2],
                'category': row[3],
                'sentiment_score': row[4],
                'views': row[5],
                'likes': row[6],
                'shares': row[7],
                'published_at': row[8],
                'reading_time': row[9],
                'featured': row[10],
                'keywords': row[11],
                'ai_processed': row[12]
            })
        
        conn.close()
        return jsonify({'articles': articles, 'count': len(articles)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics')
def get_analytics():
    """الحصول على التحليلات المتقدمة"""
    try:
        conn = sqlite3.connect('golan24_revolutionary_integrated.db')
        cursor = conn.cursor()
        
        # إحصائيات شاملة
        cursor.execute('SELECT COUNT(*) FROM articles')
        total_articles = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(views) FROM articles')
        total_views = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT SUM(likes) FROM articles')
        total_likes = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT SUM(shares) FROM articles')
        total_shares = cursor.fetchone()[0] or 0
        
        cursor.execute('SELECT COUNT(*) FROM articles WHERE ai_processed = 1')
        ai_processed = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(sentiment_score) FROM articles WHERE sentiment_score IS NOT NULL')
        avg_sentiment = cursor.fetchone()[0] or 0.0
        
        # أفضل الفئات
        cursor.execute('''
            SELECT category, COUNT(*) as count 
            FROM articles 
            GROUP BY category 
            ORDER BY count DESC 
            LIMIT 5
        ''')
        top_categories = [{'category': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        # أفضل الكلمات المفتاحية
        cursor.execute('''
            SELECT keywords, COUNT(*) as count 
            FROM articles 
            WHERE keywords IS NOT NULL 
            GROUP BY keywords 
            ORDER BY count DESC 
            LIMIT 10
        ''')
        top_keywords = [{'keywords': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'total_articles': total_articles,
            'total_views': total_views,
            'total_likes': total_likes,
            'total_shares': total_shares,
            'ai_processed': ai_processed,
            'average_sentiment': round(avg_sentiment, 3),
            'top_categories': top_categories,
            'top_keywords': top_keywords,
            'system_performance': 95.5,
            'last_updated': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai-status')
def ai_status():
    """حالة الذكاء الاصطناعي"""
    if ai_engine:
        return jsonify({
            'status': 'active',
            'engine': 'RevolutionaryAIEngine',
            'models_available': list(ai_engine.models.keys()),
            'processing_stats': ai_engine.processing_stats,
            'last_processed': ai_engine.processing_stats.get('last_processed'),
            'api_key_configured': bool(ai_engine.openai_key)
        })
    else:
        return jsonify({
            'status': 'inactive',
            'error': 'AI engine not loaded'
        })

@app.route('/api/automation')
def automation_status():
    """حالة نظام الأتمتة"""
    if automation_system:
        return jsonify({
            'status': 'active',
            'system': 'RevolutionaryAutomationSystem',
            'is_running': automation_system.is_running,
            'sources_count': len(automation_system.sources),
            'active_sources': len([s for s in automation_system.sources if s['active']]),
            'processing_stats': automation_system.processing_stats,
            'last_run': automation_system.processing_stats.get('last_run')
        })
    else:
        return jsonify({
            'status': 'inactive',
            'error': 'Automation system not loaded'
        })

@app.route('/api/sources')
def get_sources():
    """الحصول على المصادر النشطة"""
    try:
        conn = sqlite3.connect('golan24_revolutionary_integrated.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT name, url, country, language, category, active, reliability_score, last_scraped
            FROM sources 
            ORDER BY name
        ''')
        
        sources = []
        for row in cursor.fetchall():
            sources.append({
                'name': row[0],
                'url': row[1],
                'country': row[2],
                'language': row[3],
                'category': row[4],
                'active': row[5],
                'reliability_score': row[6],
                'last_scraped': row[7]
            })
        
        conn.close()
        return jsonify({'sources': sources, 'count': len(sources)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# أحداث WebSocket
@socketio.on('connect')
def handle_connect():
    """معالجة اتصال WebSocket"""
    logger.info(f"WebSocket connected: {request.sid}")
    emit('connected', {'status': 'connected', 'timestamp': datetime.now().isoformat()})

@socketio.on('disconnect')
def handle_disconnect():
    """معالجة قطع اتصال WebSocket"""
    logger.info(f"WebSocket disconnected: {request.sid}")

@socketio.on('request_update')
def handle_update_request():
    """معالجة طلب تحديث"""
    try:
        conn = sqlite3.connect('golan24_revolutionary_integrated.db')
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM articles')
        articles_count = cursor.fetchone()[0]
        conn.close()
        
        emit('update', {
            'articles_count': articles_count,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        emit('error', {'error': str(e)})

# تشغيل النظام
if __name__ == '__main__':
    try:
        # تهيئة قاعدة البيانات
        init_revolutionary_database()
        logger.info("✅ تم تهيئة قاعدة البيانات بنجاح")
        
        # بدء نظام الأتمتة إذا كان متاحاً
        if automation_system:
            automation_system.start_automation()
            logger.info("✅ تم بدء نظام الأتمتة")
        
        # تشغيل الخادم
        logger.info("🚀 بدء تشغيل النظام الثوري المتكامل - المرحلة الثالثة")
        socketio.run(app, host='0.0.0.0', port=5000, debug=True)
        
    except Exception as e:
        logger.error(f"❌ خطأ في تشغيل النظام: {e}")
        raise
