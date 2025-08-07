from flask import Blueprint, jsonify, request
from ..models.financial import CryptoCurrency, StockMarket, EconomicIndicator
from ..models.database import db
import requests
from datetime import datetime

financial_bp = Blueprint('financial', __name__)

@financial_bp.route('/api/financial/crypto', methods=['GET'])
def get_cryptocurrencies():
    try:
        cryptos = CryptoCurrency.query.all()
        if not cryptos:
            mock_cryptos = [
                {
                    'id': 1,
                    'symbol': 'BTC',
                    'name': 'Bitcoin',
                    'current_price': 43250.50,
                    'price_change_24h': 1250.30,
                    'price_change_percentage_24h': 2.98,
                    'market_cap': 847500000000,
                    'volume_24h': 28500000000,
                    'circulating_supply': 19600000,
                    'total_supply': 19600000,
                    'max_supply': 21000000,
                    'ath': 69000.00,
                    'atl': 67.81,
                    'last_updated': datetime.utcnow().isoformat()
                },
                {
                    'id': 2,
                    'symbol': 'ETH',
                    'name': 'Ethereum',
                    'current_price': 2650.75,
                    'price_change_24h': 85.25,
                    'price_change_percentage_24h': 3.32,
                    'market_cap': 318500000000,
                    'volume_24h': 15200000000,
                    'circulating_supply': 120200000,
                    'total_supply': 120200000,
                    'max_supply': None,
                    'ath': 4878.26,
                    'atl': 0.43,
                    'last_updated': datetime.utcnow().isoformat()
                },
                {
                    'id': 3,
                    'symbol': 'BNB',
                    'name': 'BNB',
                    'current_price': 315.80,
                    'price_change_24h': -8.45,
                    'price_change_percentage_24h': -2.61,
                    'market_cap': 47200000000,
                    'volume_24h': 1850000000,
                    'circulating_supply': 149500000,
                    'total_supply': 149500000,
                    'max_supply': 200000000,
                    'ath': 686.31,
                    'atl': 0.096,
                    'last_updated': datetime.utcnow().isoformat()
                }
            ]
            return jsonify(mock_cryptos)
        
        return jsonify([crypto.to_dict() for crypto in cryptos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/api/financial/stocks', methods=['GET'])
def get_stocks():
    try:
        stocks = StockMarket.query.all()
        if not stocks:
            mock_stocks = [
                {
                    'id': 1,
                    'symbol': 'AAPL',
                    'name': 'Apple Inc.',
                    'market': 'NASDAQ',
                    'sector': 'Technology',
                    'industry': 'Consumer Electronics',
                    'current_price': 185.25,
                    'price_change': 2.15,
                    'price_change_percentage': 1.17,
                    'volume': 45200000,
                    'avg_volume': 52800000,
                    'market_cap': 2850000000000,
                    'pe_ratio': 28.5,
                    'dividend_yield': 0.52,
                    'week_52_high': 199.62,
                    'week_52_low': 124.17,
                    'beta': 1.25,
                    'eps': 6.50,
                    'last_updated': datetime.utcnow().isoformat()
                },
                {
                    'id': 2,
                    'symbol': 'MSFT',
                    'name': 'Microsoft Corporation',
                    'market': 'NASDAQ',
                    'sector': 'Technology',
                    'industry': 'Software',
                    'current_price': 378.90,
                    'price_change': -1.85,
                    'price_change_percentage': -0.49,
                    'volume': 28500000,
                    'avg_volume': 32100000,
                    'market_cap': 2820000000000,
                    'pe_ratio': 32.8,
                    'dividend_yield': 0.68,
                    'week_52_high': 384.30,
                    'week_52_low': 213.43,
                    'beta': 0.89,
                    'eps': 11.55,
                    'last_updated': datetime.utcnow().isoformat()
                },
                {
                    'id': 3,
                    'symbol': 'GOOGL',
                    'name': 'Alphabet Inc.',
                    'market': 'NASDAQ',
                    'sector': 'Technology',
                    'industry': 'Internet Services',
                    'current_price': 142.65,
                    'price_change': 0.95,
                    'price_change_percentage': 0.67,
                    'volume': 22800000,
                    'avg_volume': 26400000,
                    'market_cap': 1780000000000,
                    'pe_ratio': 25.2,
                    'dividend_yield': 0.00,
                    'week_52_high': 153.78,
                    'week_52_low': 83.34,
                    'beta': 1.05,
                    'eps': 5.66,
                    'last_updated': datetime.utcnow().isoformat()
                }
            ]
            return jsonify(mock_stocks)
        
        return jsonify([stock.to_dict() for stock in stocks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/api/financial/indicators', methods=['GET'])
def get_economic_indicators():
    try:
        indicators = EconomicIndicator.query.all()
        if not indicators:
            mock_indicators = [
                {
                    'id': 1,
                    'name': 'GDP Growth Rate',
                    'country': 'USA',
                    'value': 2.4,
                    'previous_value': 2.1,
                    'change': 0.3,
                    'change_percentage': 14.29,
                    'unit': '%',
                    'frequency': 'Quarterly',
                    'importance': 'High',
                    'last_updated': datetime.utcnow().isoformat()
                },
                {
                    'id': 2,
                    'name': 'Inflation Rate',
                    'country': 'USA',
                    'value': 3.2,
                    'previous_value': 3.7,
                    'change': -0.5,
                    'change_percentage': -13.51,
                    'unit': '%',
                    'frequency': 'Monthly',
                    'importance': 'High',
                    'last_updated': datetime.utcnow().isoformat()
                },
                {
                    'id': 3,
                    'name': 'Unemployment Rate',
                    'country': 'USA',
                    'value': 3.8,
                    'previous_value': 3.9,
                    'change': -0.1,
                    'change_percentage': -2.56,
                    'unit': '%',
                    'frequency': 'Monthly',
                    'importance': 'High',
                    'last_updated': datetime.utcnow().isoformat()
                }
            ]
            return jsonify(mock_indicators)
        
        return jsonify([indicator.to_dict() for indicator in indicators])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/api/financial/news', methods=['GET'])
def get_financial_news():
    try:
        mock_financial_news = [
            {
                'id': 1,
                'title': 'البيتكوين يرتفع إلى مستويات قياسية جديدة وسط تفاؤل المستثمرين',
                'summary': 'شهدت عملة البيتكوين ارتفاعاً كبيراً خلال الأسبوع الماضي، مما يعكس ثقة متزايدة من المستثمرين في العملات الرقمية.',
                'category': 'cryptocurrency',
                'impact': 'high',
                'published_at': datetime.utcnow().isoformat(),
                'source': 'جولان 24 الاقتصادي'
            },
            {
                'id': 2,
                'title': 'أسهم التكنولوجيا تقود مكاسب الأسواق الأمريكية',
                'summary': 'حققت أسهم شركات التكنولوجيا الكبرى مكاسب قوية في جلسة التداول الأخيرة، مدفوعة بنتائج أرباح إيجابية.',
                'category': 'stocks',
                'impact': 'medium',
                'published_at': datetime.utcnow().isoformat(),
                'source': 'جولان 24 الاقتصادي'
            },
            {
                'id': 3,
                'title': 'البنك المركزي الأمريكي يبقي أسعار الفائدة دون تغيير',
                'summary': 'قرر البنك الاحتياطي الفيدرالي الإبقاء على أسعار الفائدة عند مستوياتها الحالية، مما يعكس نهجاً حذراً في السياسة النقدية.',
                'category': 'economics',
                'impact': 'high',
                'published_at': datetime.utcnow().isoformat(),
                'source': 'جولان 24 الاقتصادي'
            }
        ]
        return jsonify(mock_financial_news)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
