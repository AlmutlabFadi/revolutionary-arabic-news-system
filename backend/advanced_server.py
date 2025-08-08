from flask import Flask, jsonify, render_template_string
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)

# إنشاء قاعدة البيانات
def init_db():
    conn = sqlite3.connect('golan24.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            summary TEXT,
            category TEXT,
            status TEXT DEFAULT 'published',
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            views INTEGER DEFAULT 0
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT,
            country TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # إضافة بيانات تجريبية
    cursor.execute('SELECT COUNT(*) FROM articles')
    if cursor.fetchone()[0] == 0:
        sample_articles = [
            ('تطورات جديدة في المفاوضات السورية', 'مصادر دبلوماسية تؤكد تقدماً في المفاوضات السورية', 'POLITICS'),
            ('إعادة افتتاح مطار حلب الدولي', 'افتتاح مطار حلب الدولي بعد أعمال التطوير', 'SYRIAN_AFFAIRS'),
            ('ارتفاع مؤشرات البورصة السورية', 'ارتفاع مؤشرات البورصة السورية بنسبة 5%', 'ECONOMY')
        ]
        
        for title, summary, category in sample_articles:
            cursor.execute('''
                INSERT INTO articles (title, summary, category) 
                VALUES (?, ?, ?)
            ''', (title, summary, category))
    
    conn.commit()
    conn.close()

# HTML template للواجهة الأمامية
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>جولان 24 - نظام الإخبار الذكي</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 3em; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        .articles { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .article { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); }
        .article h3 { margin-top: 0; color: #ffd700; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; text-align: center; }
        .stat h3 { margin: 0; color: #ffd700; }
        .api-links { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-top: 30px; }
        .api-links a { color: #ffd700; text-decoration: none; }
        .api-links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 جولان 24</h1>
            <p>نظام الإخبار الذكي المتطور</p>
        </div>
        
        <div class="status">
            <h2>📊 حالة النظام</h2>
            <p>✅ الخادم يعمل بشكل طبيعي</p>
            <p>🕐 آخر تحديث: {{ timestamp }}</p>
        </div>
        
        <div class="stats">
            <div class="stat">
                <h3>{{ articles_count }}</h3>
                <p>مقال</p>
            </div>
            <div class="stat">
                <h3>{{ sources_count }}</h3>
                <p>مصدر إخباري</p>
            </div>
            <div class="stat">
                <h3>{{ total_views }}</h3>
                <p>مشاهدة</p>
            </div>
        </div>
        
        <h2>📰 أحدث المقالات</h2>
        <div class="articles">
            {% for article in articles %}
            <div class="article">
                <h3>{{ article.title }}</h3>
                <p>{{ article.summary }}</p>
                <small>📅 {{ article.published_at }} | 👁️ {{ article.views }} مشاهدة</small>
            </div>
            {% endfor %}
        </div>
        
        <div class="api-links">
            <h2>🔗 روابط API</h2>
            <p><a href="/api/health">📊 Health Check</a></p>
            <p><a href="/api/articles">📰 جميع المقالات</a></p>
            <p><a href="/api/sources">📡 مصادر الأخبار</a></p>
        </div>
    </div>
</body>
</html>
'''

@app.route('/')
def home():
    conn = sqlite3.connect('golan24.db')
    cursor = conn.cursor()
    
    # إحصائيات
    cursor.execute('SELECT COUNT(*) FROM articles')
    articles_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM sources')
    sources_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT SUM(views) FROM articles')
    total_views = cursor.fetchone()[0] or 0
    
    # أحدث المقالات
    cursor.execute('''
        SELECT title, summary, published_at, views 
        FROM articles 
        ORDER BY published_at DESC 
        LIMIT 6
    ''')
    articles = []
    for row in cursor.fetchall():
        articles.append({
            'title': row[0],
            'summary': row[1],
            'published_at': row[2],
            'views': row[3]
        })
    
    conn.close()
    
    return render_template_string(HTML_TEMPLATE, 
                               articles=articles,
                               articles_count=articles_count,
                               sources_count=sources_count,
                               total_views=total_views,
                               timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'message': 'النظام يعمل بشكل طبيعي'
    })

@app.route('/api/articles')
def get_articles():
    conn = sqlite3.connect('golan24.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, title, summary, category, status, published_at, views 
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
            'status': row[4],
            'published_at': row[5],
            'views': row[6]
        })
    
    conn.close()
    
    return jsonify({
        'articles': articles,
        'total': len(articles)
    })

@app.route('/api/sources')
def get_sources():
    conn = sqlite3.connect('golan24.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, url, country, is_active FROM sources')
    
    sources = []
    for row in cursor.fetchall():
        sources.append({
            'id': row[0],
            'name': row[1],
            'url': row[2],
            'country': row[3],
            'is_active': bool(row[4])
        })
    
    conn.close()
    
    return jsonify({
        'sources': sources,
        'total': len(sources)
    })

if __name__ == '__main__':
    print("🚀 بدء تشغيل نظام جولان 24 المتقدم...")
    print("📊 تهيئة قاعدة البيانات...")
    init_db()
    print("✅ قاعدة البيانات جاهزة")
    print("🌐 الخادم يعمل على: http://localhost:5000")
    print("📊 Health Check: http://localhost:5000/api/health")
    print("📰 API: http://localhost:5000/api/articles")
    print("\n⚡ النظام جاهز للعمل!")
    
    app.run(host='127.0.0.1', port=5000, debug=False)
