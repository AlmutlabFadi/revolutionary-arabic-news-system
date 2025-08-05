from flask import Blueprint, jsonify, request, current_app
from datetime import datetime
from ..models.database import db
from ..models.news import ScrapingLog
from ..services.performance_monitor import performance_monitor

automation_bp = Blueprint('automation', __name__)

@automation_bp.route('/status', methods=['GET'])
def get_automation_status():
    try:
        automation_service = getattr(current_app, 'automation_service', None)
        
        if not automation_service:
            return jsonify({
                'is_running': False,
                'error': 'Automation service not initialized'
            }), 500
        
        status = automation_service.get_automation_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/toggle', methods=['POST'])
def toggle_automation():
    try:
        automation_service = getattr(current_app, 'automation_service', None)
        
        if not automation_service:
            return jsonify({'error': 'Automation service not initialized'}), 500
        
        if automation_service.is_running:
            automation_service.stop_automation()
            message = 'Automation stopped'
        else:
            automation_service.start_automation()
            message = 'Automation started'
        
        return jsonify({
            'message': message,
            'is_running': automation_service.is_running
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/settings', methods=['PUT'])
def update_automation_settings():
    try:
        automation_service = getattr(current_app, 'automation_service', None)
        
        if not automation_service:
            return jsonify({'error': 'Automation service not initialized'}), 500
        
        settings = request.get_json()
        automation_service.update_settings(settings)
        
        return jsonify({
            'message': 'Settings updated successfully',
            'settings': settings
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/manual-scrape', methods=['POST'])
def manual_scrape():
    try:
        automation_service = getattr(current_app, 'automation_service', None)
        
        if not automation_service:
            return jsonify({'error': 'Automation service not initialized'}), 500
        
        data = request.get_json() or {}
        source_key = data.get('source_key')
        
        if source_key:
            result = automation_service.manual_scrape_source(source_key)
        else:
            result = automation_service.run_full_scraping_cycle()
        
        return jsonify({
            'message': 'Manual scraping completed',
            'result': result,
            'articles_processed': result.get('articles_saved', 0) if isinstance(result, dict) else 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/logs', methods=['GET'])
def get_scraping_logs():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        logs = ScrapingLog.query.order_by(
            ScrapingLog.scraped_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'logs': [{
                'id': log.id,
                'source_name': log.source_name,
                'articles_found': log.articles_found,
                'articles_saved': log.articles_saved,
                'errors': log.errors,
                'scraped_at': log.scraped_at.isoformat(),
                'duration': log.duration,
                'status': log.status
            } for log in logs.items],
            'pagination': {
                'page': logs.page,
                'pages': logs.pages,
                'per_page': logs.per_page,
                'total': logs.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/performance', methods=['GET'])
def get_performance_metrics():
    try:
        metrics = performance_monitor.get_metrics()
        return jsonify(metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
