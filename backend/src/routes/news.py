from flask import Blueprint, jsonify, request
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from ..models.database import db
from ..models.news import NewsArticle, NewsSource, NewsCategory, NewsStatus

news_bp = Blueprint('news', __name__)

@news_bp.route('/articles', methods=['GET'])
def get_articles():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        status = request.args.get('status')
        
        query = NewsArticle.query
        
        if category:
            try:
                category_enum = NewsCategory(category)
                query = query.filter(NewsArticle.category == category_enum)
            except ValueError:
                pass
        
        if status:
            try:
                status_enum = NewsStatus(status)
                query = query.filter(NewsArticle.status == status_enum)
            except ValueError:
                pass
        
        query = query.order_by(desc(NewsArticle.published_at))
        
        articles = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'articles': [{
                'id': article.id,
                'title': article.title,
                'summary': article.summary,
                'content': article.content,
                'image_url': article.image_url,
                'author': article.author,
                'category': article.category.value if article.category else None,
                'status': article.status.value if article.status else None,
                'source': article.source.name if article.source else None,
                'published_at': article.published_at.isoformat() if article.published_at else None,
                'views': article.views,
                'ai_processed': True
            } for article in articles.items],
            'pagination': {
                'page': articles.page,
                'pages': articles.pages,
                'per_page': articles.per_page,
                'total': articles.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    try:
        article = NewsArticle.query.get_or_404(article_id)
        
        article.views += 1
        db.session.commit()
        
        return jsonify({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'summary': article.summary,
            'image_url': article.image_url,
            'author': article.author,
            'category': article.category.value if article.category else None,
            'status': article.status.value if article.status else None,
            'source': article.source.name if article.source else None,
            'published_at': article.published_at.isoformat() if article.published_at else None,
            'views': article.views,
            'ai_processed': article.ai_processed,
            'ai_summary': article.ai_summary,
            'sentiment_score': article.sentiment_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/articles/breaking', methods=['GET'])
def get_breaking_news():
    try:
        articles = NewsArticle.query.filter(
            NewsArticle.status == NewsStatus.BREAKING
        ).order_by(desc(NewsArticle.published_at)).limit(5).all()
        
        return jsonify([{
            'id': article.id,
            'title': article.title,
            'summary': article.summary,
            'published_at': article.published_at.isoformat() if article.published_at else None,
            'source': article.source.name if article.source else None
        } for article in articles])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/articles/trending', methods=['GET'])
def get_trending_news():
    try:
        articles = NewsArticle.query.filter(
            NewsArticle.status == NewsStatus.PUBLISHED,
            NewsArticle.published_at >= datetime.utcnow() - timedelta(days=7)
        ).order_by(desc(NewsArticle.views)).limit(10).all()
        
        return jsonify([{
            'id': article.id,
            'title': article.title,
            'views': article.views,
            'published_at': article.published_at.isoformat() if article.published_at else None,
            'source': article.source.name if article.source else None
        } for article in articles])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/articles/syrian-affairs', methods=['GET'])
def get_syrian_affairs():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        articles = NewsArticle.query.filter(
            NewsArticle.category == NewsCategory.SYRIAN_AFFAIRS,
            NewsArticle.status == NewsStatus.PUBLISHED
        ).order_by(desc(NewsArticle.published_at)).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'articles': [{
                'id': article.id,
                'title': article.title,
                'summary': article.summary,
                'image_url': article.image_url,
                'source': article.source.name if article.source else None,
                'published_at': article.published_at.isoformat() if article.published_at else None,
                'views': article.views,
                'ai_processed': True
            } for article in articles.items],
            'pagination': {
                'page': articles.page,
                'pages': articles.pages,
                'per_page': articles.per_page,
                'total': articles.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/sources', methods=['GET'])
def get_sources():
    try:
        sources = NewsSource.query.filter(NewsSource.is_active == True).all()
        
        return jsonify([{
            'id': source.id,
            'name': source.name,
            'url': source.url,
            'country': source.country,
            'language': source.language,
            'articles_count': len(source.articles)
        } for source in sources])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        today = datetime.utcnow().date()
        
        total_articles = NewsArticle.query.count()
        today_articles = NewsArticle.query.filter(
            func.date(NewsArticle.published_at) == today
        ).count()
        total_views = db.session.query(func.sum(NewsArticle.views)).scalar() or 0
        active_sources = NewsSource.query.filter(NewsSource.is_active == True).count()
        
        return jsonify({
            'total_articles': total_articles,
            'today_articles': today_articles,
            'total_views': total_views,
            'active_sources': active_sources
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
