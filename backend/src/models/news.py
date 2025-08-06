from datetime import datetime
from enum import Enum
from .database import db

class NewsCategory(Enum):
    POLITICS = "politics"
    ECONOMY = "economy"
    SPORTS = "sports"
    SYRIAN_AFFAIRS = "syrian_affairs"
    INTERNATIONAL = "international"
    TECHNOLOGY = "technology"
    HEALTH = "health"
    CULTURE = "culture"
    CRYPTOCURRENCY = "cryptocurrency"
    STOCK_MARKET = "stock_market"
    GENERAL = "general"

class NewsStatus(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    BREAKING = "breaking"
    ARCHIVED = "archived"

class NewsSource(db.Model):
    __tablename__ = 'news_sources'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    url = db.Column(db.String(500), nullable=False)
    rss_url = db.Column(db.String(500))
    country = db.Column(db.String(100))
    language = db.Column(db.String(10), default='ar')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    articles = db.relationship('NewsArticle', backref='source', lazy=True)
    scraping_logs = db.relationship('ScrapingLog', backref='source_ref', lazy=True)

class NewsArticle(db.Model):
    __tablename__ = 'news_articles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text)
    summary = db.Column(db.Text)
    original_url = db.Column(db.String(1000))
    image_url = db.Column(db.String(1000))
    author = db.Column(db.String(200))
    category = db.Column(db.Enum(NewsCategory), default=NewsCategory.GENERAL)
    status = db.Column(db.Enum(NewsStatus), default=NewsStatus.DRAFT)
    source_id = db.Column(db.Integer, db.ForeignKey('news_sources.id'), nullable=False)
    published_at = db.Column(db.DateTime)
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    content_hash = db.Column(db.String(32), unique=True)
    ai_processed = db.Column(db.Boolean, default=False)
    ai_summary = db.Column(db.Text)
    ai_tags = db.Column(db.Text)
    sentiment_score = db.Column(db.Float)

class ScrapingLog(db.Model):
    __tablename__ = 'scraping_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, db.ForeignKey('news_sources.id'), nullable=False)
    source_name = db.Column(db.String(200), nullable=False)
    articles_found = db.Column(db.Integer, default=0)
    articles_saved = db.Column(db.Integer, default=0)
    errors = db.Column(db.Integer, default=0)
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Float)
    status = db.Column(db.String(50), default='completed')

class SystemMetrics(db.Model):
    __tablename__ = 'system_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    metric_name = db.Column(db.String(100), nullable=False)
    metric_value = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    meta_data = db.Column(db.Text)
