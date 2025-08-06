import requests
import json
from typing import Dict, List
import logging
import os

logger = logging.getLogger(__name__)

class SocialMediaService:
    def __init__(self):
        self.facebook_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
        self.telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.whatsapp_token = os.getenv('WHATSAPP_ACCESS_TOKEN')
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        self.tiktok_token = os.getenv('TIKTOK_ACCESS_TOKEN')
        self.instagram_token = os.getenv('INSTAGRAM_ACCESS_TOKEN')

    def publish_to_facebook(self, content: str, image_url: str = None) -> bool:
        try:
            if not self.facebook_token:
                logger.warning("Facebook token not configured")
                return False

            url = f"https://graph.facebook.com/v18.0/me/feed"
            data = {
                'message': content,
                'access_token': self.facebook_token
            }
            
            if image_url:
                data['link'] = image_url

            response = requests.post(url, data=data)
            return response.status_code == 200

        except Exception as e:
            logger.error(f"Facebook publish error: {str(e)}")
            return False

    def publish_to_telegram(self, content: str, chat_id: str) -> bool:
        try:
            if not self.telegram_token:
                logger.warning("Telegram token not configured")
                return False

            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            data = {
                'chat_id': chat_id,
                'text': content,
                'parse_mode': 'HTML'
            }

            response = requests.post(url, data=data)
            return response.status_code == 200

        except Exception as e:
            logger.error(f"Telegram publish error: {str(e)}")
            return False

    def publish_to_whatsapp(self, content: str, phone_number: str) -> bool:
        try:
            if not self.whatsapp_token:
                logger.warning("WhatsApp token not configured")
                return False

            url = "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages"
            headers = {
                'Authorization': f'Bearer {self.whatsapp_token}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'messaging_product': 'whatsapp',
                'to': phone_number,
                'type': 'text',
                'text': {'body': content}
            }

            response = requests.post(url, headers=headers, json=data)
            return response.status_code == 200

        except Exception as e:
            logger.error(f"WhatsApp publish error: {str(e)}")
            return False

    def auto_publish_article(self, article_data: Dict) -> Dict:
        results = {}
        
        content = f"{article_data['title']}\n\n{article_data['summary']}\n\n#جولان24 #أخبار"
        
        results['facebook'] = self.publish_to_facebook(content, article_data.get('image_url'))
        results['telegram'] = self.publish_to_telegram(content, '@golan24_channel')
        results['whatsapp'] = self.publish_to_whatsapp(content, 'broadcast_list_id')
        
        return results
