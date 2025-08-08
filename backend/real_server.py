#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
الخادم الحقيقي - جولان 24
Real Server - Golan 24
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv
from real_automation_system import automation_system

# تحميل متغيرات البيئة
load_dotenv()

# إنشاء تطبيق Flask
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'golan24-secret-key')

# إعداد CORS
CORS(app, origins="*", supports_credentials=True)

@app.route('/')
def home():
    """الصفحة الرئيسية"""
    return jsonify({
        'message': '🚀 جولان 24 - النظام الثوري يعمل!',
        'status': 'running',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0',
        'features': [
            'أتمتة فائقة السرعة',
            'ذكاء اصطناعي متقدم',
            'معالجة أقل من 60 ثانية',
            'واجهة عربية احترافية'
        ]
    })

@app.route('/api/health')
def health():
    """فحص صحة النظام"""
    return jsonify({
        'status': 'healthy',
        'message': 'النظام يعمل بكفاءة عالية',
        'timestamp': datetime.utcnow().isoformat(),
        'automation_status': automation_system.get_status()
    })

@app.route('/api/automation/status')
def automation_status():
    """حالة الأتمتة"""
    return jsonify(automation_system.get_status())

@app.route('/api/automation/start', methods=['POST'])
def start_automation():
    """بدء الأتمتة"""
    try:
        success = automation_system.start_automation()
        return jsonify({
            'success': success,
            'message': 'تم بدء الأتمتة بنجاح' if success else 'الأتمتة تعمل بالفعل',
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/automation/stop', methods=['POST'])
def stop_automation():
    """إيقاف الأتمتة"""
    try:
        success = automation_system.stop_automation()
        return jsonify({
            'success': success,
            'message': 'تم إيقاف الأتمتة بنجاح',
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/automation/manual-scrape', methods=['POST'])
def manual_scrape():
    """معالجة يدوية فورية"""
    try:
        result = automation_system.manual_process()
        return jsonify({
            'success': True,
            'message': 'تمت المعالجة بنجاح',
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/api/automation/performance')
def automation_performance():
    """أداء الأتمتة"""
    return jsonify({
        'articles_processed': automation_system.articles_processed,
        'last_processing_time': automation_system.last_processing_time,
        'is_running': automation_system.is_running,
        'sources_count': len(automation_system.sources),
        'metrics': {
            'processing_speed': f"{automation_system.last_processing_time:.2f}s" if automation_system.last_processing_time > 0 else "N/A",
            'articles_per_minute': automation_system.articles_processed / max(automation_system.last_processing_time / 60, 1),
            'efficiency': "عالية" if automation_system.last_processing_time < 60 else "متوسطة"
        },
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/ai-status')
def ai_status():
    """حالة الذكاء الاصطناعي"""
    openai_key = os.getenv('OPENAI_API_KEY')
    return jsonify({
        'openai_available': bool(openai_key),
        'key_length': len(openai_key) if openai_key else 0,
        'status': 'متصل' if openai_key else 'غير متصل',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/news/stats')
def news_stats():
    """إحصائيات الأخبار"""
    return jsonify({
        'total_articles': automation_system.articles_processed,
        'today_articles': automation_system.articles_processed,  # محاكاة
        'total_views': automation_system.articles_processed * 100,  # محاكاة
        'active_sources': len(automation_system.sources),
        'processing_time_avg': automation_system.last_processing_time,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/news/articles')
def get_articles():
    """الحصول على المقالات"""
    # محاكاة المقالات
    articles = [
        {
            'id': i,
            'title': f'خبر رقم {i} - جولان 24',
            'content': f'محتوى الخبر رقم {i} من جولان 24',
            'category': 'politics',
            'source': 'جولان 24',
            'published_at': datetime.utcnow().isoformat(),
            'views': i * 10,
            'ai_processed': True
        }
        for i in range(1, 11)
    ]
    
    return jsonify({
        'articles': articles,
        'total': len(articles),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/analytics/')
def get_analytics():
    """التحليلات"""
    return jsonify({
        'overview': {
            'total_articles': automation_system.articles_processed,
            'processing_time': automation_system.last_processing_time,
            'sources_count': len(automation_system.sources),
            'automation_status': automation_system.is_running
        },
        'chartData': [
            {'date': '2024-01-01', 'articles': 10, 'views': 1000},
            {'date': '2024-01-02', 'articles': 15, 'views': 1500},
            {'date': '2024-01-03', 'articles': 20, 'views': 2000}
        ],
        'categoryData': [
            {'category': 'سياسة', 'count': 30},
            {'category': 'اقتصاد', 'count': 25},
            {'category': 'رياضة', 'count': 20}
        ],
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/test')
def test_endpoint():
    """اختبار API"""
    return jsonify({
        'message': '✅ API يعمل بشكل صحيح',
        'automation_running': automation_system.is_running,
        'articles_processed': automation_system.articles_processed,
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    print("🚀 تشغيل الخادم الحقيقي لجولان 24...")
    print("📡 API متاح على: http://localhost:5000")
    print("🔍 فحص الصحة: http://localhost:5000/api/health")
    print("🤖 حالة الأتمتة: http://localhost:5000/api/automation/status")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
