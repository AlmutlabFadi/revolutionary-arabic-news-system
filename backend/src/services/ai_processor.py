import openai
import json
import re
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime
import hashlib
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AINewsProcessor:
    def __init__(self):
        openai.api_key = os.getenv('OPENAI_API_KEY')
        
        self.summarization_prompt = """
        أنت محرر أخبار محترف. قم بتلخيص المقال التالي في 2-3 جمل واضحة ومفيدة:

        العنوان: {title}
        المحتوى: {content}

        التلخيص:
        """
        
        self.rewriting_prompt = """
        أنت محرر أخبار محترف. أعد كتابة المقال التالي بأسلوب صحفي احترافي مع الحفاظ على جميع الحقائق والمعلومات:

        العنوان الأصلي: {title}
        المحتوى الأصلي: {content}

        المقال المُعاد كتابته:
        العنوان الجديد:
        المحتوى الجديد:
        """
        
        self.categorization_prompt = """
        صنف المقال التالي إلى إحدى الفئات التالية فقط:
        - politics
        - economy
        - sports
        - syrian_affairs
        - international
        - technology
        - health
        - culture
        - general

        العنوان: {title}
        المحتوى: {content}

        الفئة:
        """
        
        self.sentiment_prompt = """
        حلل المشاعر في المقال التالي وأعط درجة من -1 إلى 1:
        -1 = سلبي جداً
        0 = محايد
        1 = إيجابي جداً

        العنوان: {title}
        المحتوى: {content}

        درجة المشاعر (رقم فقط):
        """
        
        self.bias_detection_prompt = """
        حلل المقال التالي واكتشف أي توجه أو تحيز سياسي أو إعلامي:

        العنوان: {title}
        المحتوى: {content}

        التحليل:
        """
        
        self.tags_generation_prompt = """
        أنشئ قائمة من 5-8 كلمات مفتاحية مناسبة للمقال التالي:

        العنوان: {title}
        المحتوى: {content}

        الكلمات المفتاحية (مفصولة بفواصل):
        """

    def call_openai_api(self, prompt: str, max_tokens: int = 500) -> Optional[str]:
        try:
            if not openai.api_key:
                logger.warning("OpenAI API key not configured")
                return None
            
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=0.7,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            
            return response.choices[0].text.strip()
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return None

    def summarize_article(self, title: str, content: str) -> str:
        prompt = self.summarization_prompt.format(title=title, content=content[:2000])
        
        result = self.call_openai_api(prompt, max_tokens=200)
        
        if result:
            return result
        else:
            sentences = content.split('.')[:3]
            return '. '.join(sentences) + '.'

    def rewrite_article(self, title: str, content: str) -> Tuple[str, str]:
        prompt = self.rewriting_prompt.format(title=title, content=content[:3000])
        
        result = self.call_openai_api(prompt, max_tokens=1000)
        
        if result and "العنوان الجديد:" in result and "المحتوى الجديد:" in result:
            parts = result.split("المحتوى الجديد:")
            new_title = parts[0].replace("العنوان الجديد:", "").strip()
            new_content = parts[1].strip()
            return new_title, new_content
        else:
            return title, content

    def categorize_article(self, title: str, content: str) -> str:
        prompt = self.categorization_prompt.format(title=title, content=content[:1500])
        
        result = self.call_openai_api(prompt, max_tokens=50)
        
        valid_categories = [
            'politics', 'economy', 'sports', 'syrian_affairs', 
            'international', 'technology', 'health', 'culture', 'general'
        ]
        
        if result and result.lower() in valid_categories:
            return result.lower()
        else:
            return self.fallback_categorization(title + " " + content)

    def fallback_categorization(self, text: str) -> str:
        text_lower = text.lower()
        
        categories = {
            'politics': ['سياسة', 'حكومة', 'رئيس', 'وزير', 'برلمان', 'انتخابات', 'دبلوماسية'],
            'economy': ['اقتصاد', 'بورصة', 'أسهم', 'استثمار', 'تجارة', 'صادرات', 'واردات'],
            'syrian_affairs': ['سوريا', 'سوري', 'دمشق', 'حلب', 'حمص', 'اللاذقية', 'درعا'],
            'sports': ['رياضة', 'كرة', 'فوز', 'هزيمة', 'مباراة', 'بطولة', 'منتخب'],
            'health': ['صحة', 'طب', 'مرض', 'علاج', 'مستشفى', 'طبيب', 'دواء'],
            'technology': ['تقنية', 'تكنولوجيا', 'ذكاء اصطناعي', 'إنترنت', 'هاتف', 'تطبيق']
        }
        
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return category
        
        return 'general'

    def analyze_sentiment(self, title: str, content: str) -> float:
        prompt = self.sentiment_prompt.format(title=title, content=content[:1500])
        
        result = self.call_openai_api(prompt, max_tokens=10)
        
        if result:
            try:
                score = float(result.strip())
                return max(-1.0, min(1.0, score))
            except ValueError:
                pass
        
        return 0.0

    def detect_bias(self, title: str, content: str) -> Dict:
        prompt = self.bias_detection_prompt.format(title=title, content=content[:2000])
        
        result = self.call_openai_api(prompt, max_tokens=300)
        
        return {
            'bias_detected': bool(result and len(result) > 50),
            'bias_analysis': result or 'لا يوجد تحيز واضح',
            'confidence': 0.7 if result else 0.3
        }

    def generate_tags(self, title: str, content: str) -> List[str]:
        prompt = self.tags_generation_prompt.format(title=title, content=content[:1500])
        
        result = self.call_openai_api(prompt, max_tokens=100)
        
        if result:
            tags = [tag.strip() for tag in result.split(',')]
            return [tag for tag in tags if len(tag) > 2][:8]
        else:
            return self.extract_keywords_fallback(title + " " + content)

    def extract_keywords_fallback(self, text: str) -> List[str]:
        common_words = {
            'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي',
            'كان', 'كانت', 'يكون', 'تكون', 'قال', 'قالت', 'أن', 'أنه', 'أنها',
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'
        }
        
        words = re.findall(r'\b\w{3,}\b', text.lower())
        word_freq = {}
        
        for word in words:
            if word not in common_words:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:6]]

    def process_article_complete(self, title: str, content: str) -> Dict:
        logger.info(f"Processing article with AI: {title[:50]}...")
        
        start_time = datetime.now()
        
        results = {
            'original_title': title,
            'original_content': content,
            'processing_time': None,
            'ai_enabled': bool(openai.api_key)
        }
        
        try:
            if not openai.api_key:
                logger.warning("OpenAI API key not configured, using fallback methods")
                results.update({
                    'summary': content[:200] + '...' if len(content) > 200 else content,
                    'rewritten_title': title,
                    'rewritten_content': content,
                    'category': self.fallback_categorization(title + " " + content),
                    'sentiment_score': 0.0,
                    'bias_analysis': {'bias_detected': False, 'bias_analysis': 'تحليل غير متاح', 'confidence': 0.0},
                    'tags': self.extract_keywords_fallback(title + " " + content)
                })
            else:
                summary = self.summarize_article(title, content)
                rewritten_title, rewritten_content = self.rewrite_article(title, content)
                category = self.categorize_article(title, content)
                sentiment_score = self.analyze_sentiment(title, content)
                bias_analysis = self.detect_bias(title, content)
                tags = self.generate_tags(title, content)
                
                results.update({
                    'summary': summary,
                    'rewritten_title': rewritten_title,
                    'rewritten_content': rewritten_content,
                    'category': category,
                    'sentiment_score': sentiment_score,
                    'bias_analysis': bias_analysis,
                    'tags': tags
                })
            
            processing_time = (datetime.now() - start_time).total_seconds()
            results['processing_time'] = processing_time
            
            logger.info(f"Article processing completed in {processing_time:.2f} seconds")
            
        except Exception as e:
            logger.error(f"Error in AI processing: {str(e)}")
            results.update({
                'summary': content[:200] + '...' if len(content) > 200 else content,
                'rewritten_title': title,
                'rewritten_content': content,
                'category': 'general',
                'sentiment_score': 0.0,
                'bias_analysis': {'bias_detected': False, 'bias_analysis': 'خطأ في التحليل', 'confidence': 0.0},
                'tags': [],
                'error': str(e)
            })
        
        return results
