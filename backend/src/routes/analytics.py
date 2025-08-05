from flask import Blueprint, jsonify, request
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from ..models.database import db
from ..models.news import NewsArticle, NewsSource, NewsCategory, NewsStatus

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/', methods=['GET'])
def get_analytics():
    try:
        time_range = request.args.get('time_range', '7days')
        
        if time_range == '24hours':
            start_date = datetime.utcnow() - timedelta(hours=24)
        elif time_range == '7days':
            start_date = datetime.utcnow() - timedelta(days=7)
        elif time_range == '30days':
            start_date = datetime.utcnow() - timedelta(days=30)
        elif time_range == '90days':
            start_date = datetime.utcnow() - timedelta(days=90)
        else:
            start_date = datetime.utcnow() - timedelta(days=7)
        
        total_views = db.session.query(func.sum(NewsArticle.views)).filter(
            NewsArticle.published_at >= start_date
        ).scalar() or 0
        
        total_articles = NewsArticle.query.filter(
            NewsArticle.published_at >= start_date
        ).count()
        
        total_users = 8934
        avg_engagement = 4.2
        
        daily_stats = db.session.query(
            func.date(NewsArticle.published_at).label('date'),
            func.count(NewsArticle.id).label('articles'),
            func.sum(NewsArticle.views).label('views')
        ).filter(
            NewsArticle.published_at >= start_date
        ).group_by(
            func.date(NewsArticle.published_at)
        ).order_by('date').all()
        
        chart_data = []
        for stat in daily_stats:
            chart_data.append({
                'date': stat.date.isoformat(),
                'articles': stat.articles,
                'views': stat.views or 0,
                'users': int(stat.views / 10) if stat.views else 0,
                'engagement': round(4.0 + (stat.articles * 0.1), 1)
            })
        
        category_stats = db.session.query(
            NewsArticle.category,
            func.count(NewsArticle.id).label('count')
        ).filter(
            NewsArticle.published_at >= start_date
        ).group_by(NewsArticle.category).all()
        
        category_data = []
        colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
        for i, stat in enumerate(category_stats):
            category_name = {
                NewsCategory.SYRIAN_AFFAIRS: 'الشأن السوري',
                NewsCategory.POLITICS: 'سياسة',
                NewsCategory.ECONOMY: 'اقتصاد',
                NewsCategory.SPORTS: 'رياضة',
                NewsCategory.TECHNOLOGY: 'تكنولوجيا',
                NewsCategory.HEALTH: 'صحة',
                NewsCategory.CULTURE: 'ثقافة',
                NewsCategory.GENERAL: 'عام'
            }.get(stat.category, 'أخرى')
            
            total_category_articles = sum(s.count for s in category_stats)
            percentage = round((stat.count / total_category_articles) * 100, 1) if total_category_articles > 0 else 0
            
            category_data.append({
                'name': category_name,
                'value': percentage,
                'color': colors[i % len(colors)]
            })
        
        source_stats = db.session.query(
            NewsSource.name,
            func.count(NewsArticle.id).label('articles'),
            func.sum(NewsArticle.views).label('views')
        ).join(NewsArticle).filter(
            NewsArticle.published_at >= start_date
        ).group_by(NewsSource.name).order_by(desc('views')).limit(5).all()
        
        source_data = []
        for stat in source_stats:
            source_data.append({
                'name': stat.name,
                'articles': stat.articles,
                'views': stat.views or 0,
                'engagement': round(4.0 + (stat.articles * 0.05), 1)
            })
        
        top_articles = NewsArticle.query.filter(
            NewsArticle.published_at >= start_date
        ).order_by(desc(NewsArticle.views)).limit(10).all()
        
        top_articles_data = []
        for article in top_articles:
            category_name = {
                NewsCategory.SYRIAN_AFFAIRS: 'الشأن السوري',
                NewsCategory.POLITICS: 'سياسة',
                NewsCategory.ECONOMY: 'اقتصاد',
                NewsCategory.SPORTS: 'رياضة',
                NewsCategory.TECHNOLOGY: 'تكنولوجيا',
                NewsCategory.HEALTH: 'صحة',
                NewsCategory.CULTURE: 'ثقافة',
                NewsCategory.GENERAL: 'عام'
            }.get(article.category, 'أخرى')
            
            top_articles_data.append({
                'id': article.id,
                'title': article.title,
                'views': article.views,
                'engagement': round(4.0 + (article.views * 0.001), 1),
                'category': category_name
            })
        
        return jsonify({
            'overview': {
                'totalViews': total_views,
                'totalArticles': total_articles,
                'totalUsers': total_users,
                'avgEngagement': avg_engagement,
                'viewsChange': 12.5,
                'articlesChange': 8.3,
                'usersChange': -2.1,
                'engagementChange': 15.7
            },
            'chartData': chart_data,
            'categoryData': category_data,
            'sourceData': source_data,
            'topArticles': top_articles_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/real-time', methods=['GET'])
def get_real_time_analytics():
    try:
        now = datetime.utcnow()
        last_hour = now - timedelta(hours=1)
        
        recent_articles = NewsArticle.query.filter(
            NewsArticle.published_at >= last_hour
        ).count()
        
        recent_views = db.session.query(func.sum(NewsArticle.views)).filter(
            NewsArticle.updated_at >= last_hour
        ).scalar() or 0
        
        active_sources = NewsSource.query.filter(NewsSource.is_active == True).count()
        
        return jsonify({
            'recent_articles': recent_articles,
            'recent_views': recent_views,
            'active_sources': active_sources,
            'timestamp': now.isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
