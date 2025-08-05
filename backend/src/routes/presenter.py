from flask import Blueprint, jsonify, request
from datetime import datetime
import json

presenter_bp = Blueprint('presenter', __name__)

@presenter_bp.route('/generate-bulletin', methods=['POST'])
def generate_bulletin():
    try:
        data = request.get_json()
        language = data.get('language', 'ar')
        bulletin_type = data.get('bulletin_type', 'regular')
        
        mock_bulletin = {
            'id': f"bulletin_{int(datetime.utcnow().timestamp())}",
            'generated_at': datetime.utcnow().isoformat(),
            'language': language,
            'type': bulletin_type,
            'script': {
                'language': language,
                'total_duration': 5.5,
                'script_parts': [
                    {
                        'type': 'opening',
                        'presenter': {
                            'name': 'أحمد الشامي' if language == 'ar' else 'Michael Johnson',
                            'voice_id': 'male_arabic' if language == 'ar' else 'male_english'
                        },
                        'text': 'أهلاً وسهلاً بكم في نشرة أخبار الشام، أنا أحمد الشامي' if language == 'ar' else 'Welcome to Sham News, I am Michael Johnson',
                        'duration_estimate': 0.5
                    },
                    {
                        'type': 'news_item',
                        'presenter': {
                            'name': 'أحمد الشامي' if language == 'ar' else 'Michael Johnson',
                            'voice_id': 'male_arabic' if language == 'ar' else 'male_english'
                        },
                        'text': 'في الأخبار الرئيسية اليوم، تطورات جديدة في المفاوضات السورية تبشر بحلول سلمية شاملة' if language == 'ar' else 'In today\'s main news, new developments in Syrian negotiations promise comprehensive peaceful solutions',
                        'duration_estimate': 2.0
                    },
                    {
                        'type': 'news_item',
                        'presenter': {
                            'name': 'سارة النوري' if language == 'ar' else 'Sarah Williams',
                            'voice_id': 'female_arabic' if language == 'ar' else 'female_english'
                        },
                        'text': 'في الأخبار الاقتصادية، ارتفاع مؤشرات البورصة السورية بنسبة 5% خلال الأسبوع الماضي' if language == 'ar' else 'In economic news, Syrian stock market indices rose by 5% last week',
                        'duration_estimate': 2.0
                    },
                    {
                        'type': 'closing',
                        'presenter': {
                            'name': 'أحمد الشامي' if language == 'ar' else 'Michael Johnson',
                            'voice_id': 'male_arabic' if language == 'ar' else 'male_english'
                        },
                        'text': 'كان معكم أحمد الشامي، شكراً لمتابعتكم ونلقاكم في النشرة القادمة' if language == 'ar' else 'This was Michael Johnson, thank you for watching and see you in the next bulletin',
                        'duration_estimate': 1.0
                    }
                ]
            }
        }
        
        return jsonify(mock_bulletin)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@presenter_bp.route('/bulletins', methods=['GET'])
def get_bulletin_history():
    try:
        mock_history = [
            {
                'id': 'bulletin_1704123600',
                'generated_at': '2024-01-15T10:00:00Z',
                'language': 'ar',
                'type': 'regular',
                'duration': 5.5,
                'articles_count': 3
            },
            {
                'id': 'bulletin_1704120000',
                'generated_at': '2024-01-15T09:00:00Z',
                'language': 'ar',
                'type': 'breaking',
                'duration': 2.0,
                'articles_count': 1
            }
        ]
        
        return jsonify(mock_history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@presenter_bp.route('/presenters', methods=['GET'])
def get_presenters():
    try:
        presenters = {
            'male_arabic': {
                'name': 'أحمد الشامي',
                'image': '/images/male_presenter_ar.jpg',
                'language': 'ar',
                'specialty': 'الأخبار العامة والسياسية'
            },
            'female_arabic': {
                'name': 'سارة النوري', 
                'image': '/images/female_presenter_ar.jpg',
                'language': 'ar',
                'specialty': 'الأخبار الاقتصادية والاجتماعية'
            },
            'male_english': {
                'name': 'Michael Johnson',
                'image': '/images/male_presenter_en.jpg',
                'language': 'en',
                'specialty': 'International News'
            },
            'female_english': {
                'name': 'Sarah Williams',
                'image': '/images/female_presenter_en.jpg',
                'language': 'en', 
                'specialty': 'Business and Technology'
            }
        }
        
        return jsonify(presenters)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
