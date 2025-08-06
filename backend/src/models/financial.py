from datetime import datetime
from enum import Enum
from .database import db

class CryptoCurrency(db.Model):
    __tablename__ = 'cryptocurrencies'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    current_price = db.Column(db.Float)
    price_change_24h = db.Column(db.Float)
    price_change_percentage_24h = db.Column(db.Float)
    market_cap = db.Column(db.BigInteger)
    volume_24h = db.Column(db.BigInteger)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

class StockMarket(db.Model):
    __tablename__ = 'stock_markets'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    market = db.Column(db.String(50), nullable=False)
    current_price = db.Column(db.Float)
    price_change = db.Column(db.Float)
    price_change_percentage = db.Column(db.Float)
    volume = db.Column(db.BigInteger)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

class FinancialNews(db.Model):
    __tablename__ = 'financial_news'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    related_symbol = db.Column(db.String(20))
    impact_score = db.Column(db.Float)
    published_at = db.Column(db.DateTime, default=datetime.utcnow)
    source_url = db.Column(db.String(1000))
