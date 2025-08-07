from flask import Blueprint, request, jsonify
from ..models.database import db
from ..models.whatsapp import ContactMessage, WhatsAppSettings

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        message = ContactMessage(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            subject=data.get('subject'),
            category=data.get('category'),
            message=data.get('message')
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم إرسال رسالتك بنجاح'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@contact_bp.route('/whatsapp-settings', methods=['GET'])
def get_whatsapp_settings():
    try:
        settings = WhatsAppSettings.query.first()
        if not settings:
            settings = WhatsAppSettings()
            db.session.add(settings)
            db.session.commit()
        
        return jsonify({
            'phone_number': settings.phone_number,
            'welcome_message': settings.welcome_message,
            'is_active': settings.is_active
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/whatsapp-settings', methods=['PUT'])
def update_whatsapp_settings():
    try:
        data = request.get_json()
        settings = WhatsAppSettings.query.first()
        
        if not settings:
            settings = WhatsAppSettings()
            db.session.add(settings)
        
        settings.phone_number = data.get('phone_number', settings.phone_number)
        settings.welcome_message = data.get('welcome_message', settings.welcome_message)
        settings.is_active = data.get('is_active', settings.is_active)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم تحديث إعدادات الواتساب بنجاح'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
