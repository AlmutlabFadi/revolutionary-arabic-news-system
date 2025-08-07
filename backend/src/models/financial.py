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
    circulating_supply = db.Column(db.BigInteger)
    total_supply = db.Column(db.BigInteger)
    max_supply = db.Column(db.BigInteger)
    ath = db.Column(db.Float)  # All-time high
    ath_date = db.Column(db.DateTime)
    atl = db.Column(db.Float)  # All-time low
    atl_date = db.Column(db.DateTime)
    roi = db.Column(db.Float)  # Return on investment
    price_change_percentage_7d = db.Column(db.Float)
    price_change_percentage_30d = db.Column(db.Float)
    price_change_percentage_1y = db.Column(db.Float)
    market_cap_rank = db.Column(db.Integer)
    fully_diluted_valuation = db.Column(db.BigInteger)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'name': self.name,
            'current_price': self.current_price,
            'price_change_24h': self.price_change_24h,
            'price_change_percentage_24h': self.price_change_percentage_24h,
            'market_cap': self.market_cap,
            'volume_24h': self.volume_24h,
            'market_cap_rank': self.market_cap_rank,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

class StockMarket(db.Model):
    __tablename__ = 'stock_markets'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    market = db.Column(db.String(50), nullable=False)  # NYSE, NASDAQ, etc.
    sector = db.Column(db.String(100))
    industry = db.Column(db.String(100))
    current_price = db.Column(db.Float)
    price_change = db.Column(db.Float)
    price_change_percentage = db.Column(db.Float)
    volume = db.Column(db.BigInteger)
    avg_volume = db.Column(db.BigInteger)
    market_cap = db.Column(db.BigInteger)
    pe_ratio = db.Column(db.Float)
    eps = db.Column(db.Float)  # Earnings per share
    dividend_yield = db.Column(db.Float)
    week_52_high = db.Column(db.Float)
    week_52_low = db.Column(db.Float)
    day_high = db.Column(db.Float)
    day_low = db.Column(db.Float)
    open_price = db.Column(db.Float)
    previous_close = db.Column(db.Float)
    beta = db.Column(db.Float)
    shares_outstanding = db.Column(db.BigInteger)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'name': self.name,
            'market': self.market,
            'sector': self.sector,
            'current_price': self.current_price,
            'price_change': self.price_change,
            'price_change_percentage': self.price_change_percentage,
            'volume': self.volume,
            'market_cap': self.market_cap,
            'pe_ratio': self.pe_ratio,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

class EconomicIndicator(db.Model):
    __tablename__ = 'economic_indicators'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Float)
    unit = db.Column(db.String(20))  # %, USD, etc.
    period = db.Column(db.String(20))  # Monthly, Quarterly, Yearly
    frequency = db.Column(db.String(20))  # Daily, Weekly, Monthly, Quarterly, Yearly
    previous_value = db.Column(db.Float)
    change = db.Column(db.Float)
    change_percentage = db.Column(db.Float)
    release_date = db.Column(db.DateTime)
    next_release = db.Column(db.DateTime)
    importance = db.Column(db.String(10))  # High, Medium, Low
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'country': self.country,
            'value': self.value,
            'unit': self.unit,
            'period': self.period,
            'frequency': self.frequency,
            'previous_value': self.previous_value,
            'change': self.change,
            'change_percentage': self.change_percentage,
            'release_date': self.release_date.isoformat() if self.release_date else None,
            'next_release': self.next_release.isoformat() if self.next_release else None,
            'importance': self.importance,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

class ForexRate(db.Model):
    __tablename__ = 'forex_rates'
    
    id = db.Column(db.Integer, primary_key=True)
    base_currency = db.Column(db.String(3), nullable=False)  # USD
    target_currency = db.Column(db.String(3), nullable=False)  # EUR
    rate = db.Column(db.Float, nullable=False)
    change_24h = db.Column(db.Float)
    change_percentage_24h = db.Column(db.Float)
    high_24h = db.Column(db.Float)
    low_24h = db.Column(db.Float)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pair': f"{self.base_currency}/{self.target_currency}",
            'rate': self.rate,
            'change_24h': self.change_24h,
            'change_percentage_24h': self.change_percentage_24h,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }


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
