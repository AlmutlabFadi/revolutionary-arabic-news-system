import os
import sys
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import logging
from datetime import datetime

load_dotenv()

from src.models.database import db
from src.routes.news import news_bp
from src.routes.automation import automation_bp
from src.routes.analytics import analytics_bp
from src.routes.presenter import presenter_bp
from src.routes.health import health_bp
from src.services.automation_service import AutomationService
from src.services.websocket_service import WebSocketService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__, static_folder='../frontend/dist')
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JSON_AS_ASCII'] = False
    
    database_url = os.getenv('DATABASE_URL', 'sqlite:///news.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])
    
    socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000", "http://localhost:5173"])
    
    db.init_app(app)
    
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(automation_bp, url_prefix='/api/automation')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(presenter_bp, url_prefix='/api/presenter')
    
    with app.app_context():
        db.create_all()
        init_sample_data()
    
    automation_service = AutomationService(app)
    websocket_service = WebSocketService(socketio, automation_service)
    
    app.automation_service = automation_service
    app.websocket_service = websocket_service
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return jsonify({"error": "Static folder not configured"}), 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return jsonify({"error": "Frontend not built"}), 404

    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'database': 'connected',
            'automation': automation_service.is_running if automation_service else False,
            'version': '1.0.0'
        })

    return app, socketio

def init_sample_data():
    from src.models.news import NewsSource, NewsArticle, NewsCategory, NewsStatus
    
    sources_data = [
        {'name': 'وكالة سانا', 'url': 'https://sana.sy', 'country': 'سوريا', 'language': 'ar', 'is_active': True},
        {'name': 'الوطن أونلاين', 'url': 'https://alwatan.sy', 'country': 'سوريا', 'language': 'ar', 'is_active': True},
        {'name': 'تشرين', 'url': 'https://tishreen.news.sy', 'country': 'سوريا', 'language': 'ar', 'is_active': True},
        {'name': 'الجزيرة', 'url': 'https://aljazeera.net', 'country': 'قطر', 'language': 'ar', 'is_active': True},
        {'name': 'العربية', 'url': 'https://alarabiya.net', 'country': 'السعودية', 'language': 'ar', 'is_active': True},
        {'name': 'BBC Arabic', 'url': 'https://bbc.com/arabic', 'country': 'بريطانيا', 'language': 'ar', 'is_active': True},
    ]
    
    for source_data in sources_data:
        if not NewsSource.query.filter_by(name=source_data['name']).first():
            source = NewsSource(**source_data)
            db.session.add(source)
    
    db.session.commit()
    
    sample_articles = [
        {
            'title': 'تطورات جديدة في المفاوضات السورية تبشر بحلول سلمية شاملة',
            'content': 'في تطور مهم للأحداث، أعلنت مصادر دبلوماسية عن تقدم ملحوظ في المفاوضات الجارية بشأن الأزمة السورية، حيث تم التوصل إلى اتفاقات أولية حول عدة نقاط مهمة تمهد الطريق لحل سلمي شامل.',
            'summary': 'مصادر دبلوماسية تؤكد تقدماً في المفاوضات السورية',
            'category': NewsCategory.POLITICS,
            'status': NewsStatus.PUBLISHED,
            'image_url': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'
        },
        {
            'title': 'إعادة افتتاح مطار حلب الدولي بعد أعمال التطوير والتحديث',
            'content': 'في خطوة مهمة نحو إعادة الإعمار، تم افتتاح مطار حلب الدولي رسمياً بعد أعمال تطوير شاملة شملت تحديث المرافق والأنظمة التقنية.',
            'summary': 'افتتاح مطار حلب الدولي بعد أعمال التطوير',
            'category': NewsCategory.SYRIAN_AFFAIRS,
            'status': NewsStatus.PUBLISHED,
            'image_url': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop'
        },
        {
            'title': 'ارتفاع مؤشرات البورصة السورية بنسبة 5% خلال الأسبوع الماضي',
            'content': 'شهدت البورصة السورية ارتفاعاً ملحوظاً في مؤشراتها الرئيسية خلال الأسبوع الماضي، مما يعكس تحسناً في الثقة الاستثمارية.',
            'summary': 'ارتفاع مؤشرات البورصة السورية بنسبة 5%',
            'category': NewsCategory.ECONOMY,
            'status': NewsStatus.PUBLISHED,
            'image_url': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop'
        },
        {
            'title': 'الرئيس السوري يعلن عن مبادرة جديدة للسلام في المنطقة',
            'content': 'أعلن الرئيس السوري عن مبادرة جديدة تهدف إلى تعزيز السلام والاستقرار في المنطقة.',
            'summary': 'مبادرة سلام جديدة من الرئيس السوري',
            'category': NewsCategory.POLITICS,
            'status': NewsStatus.BREAKING,
            'image_url': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'
        }
    ]
    
    source = NewsSource.query.first()
    if source:
        for article_data in sample_articles:
            if not NewsArticle.query.filter_by(title=article_data['title']).first():
                article = NewsArticle(
                    title=article_data['title'],
                    content=article_data['content'],
                    summary=article_data['summary'],
                    category=article_data['category'],
                    status=article_data['status'],
                    source_id=source.id,
                    published_at=datetime.utcnow(),
                    views=0,
                    image_url=article_data.get('image_url')
                )
                db.session.add(article)
    
    db.session.commit()

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
