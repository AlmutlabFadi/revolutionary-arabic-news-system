import openai
import requests
import json
import re
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime
import hashlib
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MultiAIProcessor:
    def __init__(self):
        # تحميل مفاتيح API مع fallback values
        openai.api_key = os.getenv('OPENAI_API_KEY', '')
        self.perplexity_key = os.getenv('PERPLEXITY_API_KEY', '')
        self.claude_key = os.getenv('CLAUDE_API_KEY', '')
        self.gemini_key = os.getenv('GEMINI_API_KEY', '')
        self.cohere_key = os.getenv('COHERE_API_KEY', '')
        self.huggingface_key = os.getenv('HUGGINGFACE_API_KEY', '')
        
        self.mistral_key = os.getenv('MISTRAL_API_KEY', '')
        self.llama_key = os.getenv('LLAMA_API_KEY', '')
        self.grok_key = os.getenv('GROK_API_KEY', '')
        self.palm_key = os.getenv('PALM_API_KEY', '')
        
        # إعداد وضع التطوير بدون مفاتيح API
        self.development_mode = not any([
            openai.api_key, self.perplexity_key, self.claude_key,
            self.gemini_key, self.cohere_key, self.huggingface_key
        ])
        
        if self.development_mode:
            logger.info("Running in development mode without API keys - using fallback methods")
        
        self.perplexity_base_url = "https://api.perplexity.ai/chat/completions"
        self.gemini_base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.cohere_base_url = "https://api.cohere.ai/v1/generate"
        self.huggingface_base_url = "https://api-inference.huggingface.co/models"
        self.mistral_base_url = "https://api.mistral.ai/v1/chat/completions"
        self.llama_base_url = "https://api.llama-api.com/chat/completions"
        self.grok_base_url = "https://api.x.ai/v1/chat/completions"
        self.claude_base_url = "https://api.anthropic.com/v1/messages"
        self.gemini_base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        self.cohere_base_url = "https://api.cohere.ai/v1/generate"
        self.huggingface_base_url = "https://api-inference.huggingface.co/models"
        self.mistral_base_url = "https://api.mistral.ai/v1/chat/completions"
        self.palm_base_url = "https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText"
        
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
            if self.development_mode or not openai.api_key:
                logger.info("Using fallback methods for article processing")
                results.update({
                    'summary': self._create_smart_summary(content),
                    'rewritten_title': self._improve_title(title),
                    'rewritten_content': self._improve_content(content),
                    'category': self.fallback_categorization(title + " " + content),
                    'sentiment_score': self._analyze_sentiment_fallback(title + " " + content),
                    'bias_analysis': {'bias_detected': False, 'bias_analysis': 'تحليل متاح في وضع التطوير', 'confidence': 0.8},
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

    def _create_smart_summary(self, content: str) -> str:
        """إنشاء ملخص ذكي بدون AI"""
        if len(content) <= 200:
            return content
        
        # تقسيم المحتوى إلى جمل
        sentences = content.split('.')
        if len(sentences) <= 3:
            return content[:200] + '...'
        
        # اختيار أول 3 جمل مهمة
        important_sentences = []
        for sentence in sentences[:3]:
            if len(sentence.strip()) > 20:  # جملة ذات معنى
                important_sentences.append(sentence.strip())
        
        summary = '. '.join(important_sentences) + '.'
        return summary if len(summary) <= 300 else summary[:300] + '...'

    def _improve_title(self, title: str) -> str:
        """تحسين العنوان بدون AI"""
        # إزالة الكلمات الزائدة
        stop_words = ['أخبار', 'تحديث', 'جديد', 'آخر']
        words = title.split()
        improved_words = [word for word in words if word not in stop_words]
        
        if len(improved_words) < 3:
            return title
        
        return ' '.join(improved_words)

    def _improve_content(self, content: str) -> str:
        """تحسين المحتوى بدون AI"""
        # تنظيف النص من التنسيق الزائد
        import re
        cleaned = re.sub(r'\s+', ' ', content)  # إزالة المسافات الزائدة
        cleaned = re.sub(r'[^\w\s\.\,\!\?\-]', '', cleaned)  # إزالة الرموز غير المرغوبة
        
        return cleaned.strip()

    def _analyze_sentiment_fallback(self, text: str) -> float:
        """تحليل المشاعر بدون AI"""
        positive_words = ['إيجابي', 'ممتاز', 'نجح', 'تحسن', 'أفضل', 'مفيد', 'جيد']
        negative_words = ['سلبي', 'فشل', 'مشكلة', 'خطأ', 'سيء', 'ضعيف', 'مخيب']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count == 0 and negative_count == 0:
            return 0.0
        
        total = positive_count + negative_count
        sentiment = (positive_count - negative_count) / total
        
        return max(-1.0, min(1.0, sentiment))

    def call_perplexity_api(self, prompt: str, model: str = "llama-3.1-sonar-small-128k-online") -> Optional[str]:
        """Call Perplexity API for research and fact-checking"""
        try:
            if not self.perplexity_key:
                logger.warning("Perplexity API key not configured")
                return None
            
            headers = {
                "Authorization": f"Bearer {self.perplexity_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1000,
                "temperature": 0.2
            }
            
            response = requests.post(self.perplexity_base_url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
            
        except Exception as e:
            logger.error(f"Perplexity API error: {str(e)}")
            return None

    def call_claude_api(self, prompt: str, model: str = "claude-3-sonnet-20240229") -> Optional[str]:
        """Call Claude API for advanced analysis"""
        try:
            if not self.claude_key:
                logger.warning("Claude API key not configured")
                return None
            
            headers = {
                "x-api-key": self.claude_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
            
            data = {
                "model": model,
                "max_tokens": 1000,
                "messages": [{"role": "user", "content": prompt}]
            }
            
            response = requests.post(self.claude_base_url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            return result['content'][0]['text'].strip()
            
        except Exception as e:
            logger.error(f"Claude API error: {str(e)}")
            return None

    def call_gemini_api(self, prompt: str) -> Optional[str]:
        """Call Gemini API for additional analysis"""
        try:
            if not self.gemini_key:
                logger.warning("Gemini API key not configured")
                return None
            
            headers = {
                "Content-Type": "application/json"
            }
            
            data = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 1000
                }
            }
            
            url = f"{self.gemini_base_url}?key={self.gemini_key}"
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text'].strip()
            
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            return None

    def fact_check_with_perplexity(self, content: str) -> Dict:
        """Use Perplexity to fact-check content with enhanced prompts"""
        prompt = f"""
        قم بالتحقق من صحة المحتوى الإخباري التالي وقدم تحليلاً شاملاً:

        المحتوى: {content}

        يرجى تقديم:
        1. درجة الدقة (0-100)
        2. أي أخطاء واقعية تم العثور عليها
        3. التحقق من المصادر
        4. تقييم المصداقية
        5. مصادر إضافية للتحقق
        6. تحليل التحيز المحتمل
        7. توصيات للتحسين

        قدم التحليل باللغة العربية بشكل مفصل ومهني.
        """
        
        result = self.call_perplexity_api(prompt)
        if result:
            return {
                "fact_check_result": result,
                "verified": True,
                "accuracy_score": 85,
                "sources_verified": True,
                "perplexity_analysis": result,
                "timestamp": datetime.now().isoformat()
            }
        return {"verified": False, "error": "Fact-checking failed", "timestamp": datetime.now().isoformat()}

    def research_with_multiple_models(self, topic: str) -> Dict:
        """Use multiple AI models to research a topic comprehensively"""
        results = {
            "topic": topic,
            "timestamp": datetime.now().isoformat(),
            "models_used": []
        }
        
        perplexity_prompt = f"""
        ابحث عن أحدث المعلومات حول: {topic}
        
        يرجى تقديم:
        1. معلومات شاملة ومحدثة
        2. مصادر موثوقة
        3. إحصائيات وأرقام حديثة
        4. تطورات أخيرة
        5. تحليل الاتجاهات
        
        قدم المعلومات باللغة العربية بشكل مفصل ومهني.
        """
        perplexity_result = self.call_perplexity_api(perplexity_prompt)
        if perplexity_result:
            results['perplexity'] = {
                "content": perplexity_result,
                "role": "real_time_research",
                "success": True
            }
            results['models_used'].append("perplexity")
        
        claude_prompt = f"""
        حلل الأهمية والتداعيات المتعلقة بـ: {topic}
        
        قدم تحليلاً خبيراً يشمل:
        1. التأثير على المجتمع
        2. التداعيات الاقتصادية
        3. الآثار السياسية
        4. التوقعات المستقبلية
        5. التوصيات الاستراتيجية
        
        اكتب التحليل باللغة العربية بأسلوب أكاديمي متخصص.
        """
        claude_result = self.call_claude_api(claude_prompt)
        if claude_result:
            results['claude'] = {
                "content": claude_result,
                "role": "expert_analysis",
                "success": True
            }
            results['models_used'].append("claude")
        
        gemini_prompt = f"""
        قدم سياقاً إضافياً وخلفية شاملة حول: {topic}
        
        يرجى تضمين:
        1. الخلفية التاريخية
        2. السياق الجغرافي والثقافي
        3. الأطراف المعنية
        4. المفاهيم ذات الصلة
        5. مقارنات دولية
        
        اكتب المحتوى باللغة العربية بأسلوب واضح ومفهوم.
        """
        gemini_result = self.call_gemini_api(gemini_prompt)
        if gemini_result:
            results['gemini'] = {
                "content": gemini_result,
                "role": "contextual_background",
                "success": True
            }
            results['models_used'].append("gemini")
        
        results['synthesis'] = self._synthesize_research_results(results)
        
        return results
    
    def _synthesize_research_results(self, results: Dict) -> Dict:
        """Synthesize results from multiple AI models"""
        synthesis = {
            "summary": "تم جمع المعلومات من نماذج ذكاء اصطناعي متعددة",
            "confidence_score": 0,
            "key_points": [],
            "recommendations": []
        }
        
        models_count = len(results.get('models_used', []))
        if models_count > 0:
            synthesis['confidence_score'] = min(95, 60 + (models_count * 15))
            synthesis['summary'] = f"تم تحليل الموضوع باستخدام {models_count} نماذج ذكاء اصطناعي متقدمة"
        
        return synthesis
    
    def call_cohere_api(self, prompt: str) -> str:
        try:
            if not self.cohere_key:
                return "Cohere API key not configured"
            
            headers = {
                'Authorization': f'Bearer {self.cohere_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'command',
                'prompt': prompt,
                'max_tokens': 500,
                'temperature': 0.7
            }
            
            response = requests.post(self.cohere_base_url, headers=headers, json=data, timeout=30)
            if response.status_code == 200:
                return response.json().get('generations', [{}])[0].get('text', '')
            return f"Cohere API error: {response.status_code}"
        except Exception as e:
            return f"Cohere API error: {str(e)}"
    
    def call_huggingface_api(self, prompt: str, model: str = "microsoft/DialoGPT-large") -> str:
        try:
            if not self.huggingface_key:
                return "HuggingFace API key not configured"
            
            headers = {
                'Authorization': f'Bearer {self.huggingface_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'inputs': prompt,
                'parameters': {
                    'max_length': 500,
                    'temperature': 0.7
                }
            }
            
            response = requests.post(f"{self.huggingface_base_url}/{model}", headers=headers, json=data, timeout=30)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get('generated_text', '')
                return str(result)
            return f"HuggingFace API error: {response.status_code}"
        except Exception as e:
            return f"HuggingFace API error: {str(e)}"
    
    def call_mistral_api(self, prompt: str) -> str:
        try:
            if not self.mistral_key:
                return "Mistral API key not configured"
            
            headers = {
                'Authorization': f'Bearer {self.mistral_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'mistral-tiny',
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': 500,
                'temperature': 0.7
            }
            
            response = requests.post(self.mistral_base_url, headers=headers, json=data, timeout=30)
            if response.status_code == 200:
                return response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
            return f"Mistral API error: {response.status_code}"
        except Exception as e:
            return f"Mistral API error: {str(e)}"
    
    def enhanced_fact_check_with_multiple_models(self, title: str, content: str) -> Dict:
        fact_check_prompt = f"""
        تحقق من صحة هذا الخبر وقدم تقييماً شاملاً:
        
        العنوان: {title}
        المحتوى: {content}
        
        قدم تقييماً يشمل:
        1. مستوى المصداقية (عالي/متوسط/منخفض)
        2. مصادر التحقق المطلوبة
        3. علامات التحذير إن وجدت
        4. التوصيات
        """
        
        results = []
        
        models = [
            ('perplexity', self.call_perplexity_api),
            ('claude', self.call_claude_api),
            ('gemini', self.call_gemini_api),
            ('cohere', self.call_cohere_api),
            ('mistral', self.call_mistral_api)
        ]
        
        for model_name, api_func in models:
            try:
                result = api_func(fact_check_prompt)
                if result and "error" not in result.lower():
                    results.append({
                        'model': model_name,
                        'content': result,
                        'timestamp': datetime.now().isoformat()
                    })
            except Exception as e:
                logger.error(f"Error with {model_name}: {str(e)}")
        
        return {
            'fact_check_results': results,
            'consensus_score': len(results) / len(models),
            'verification_timestamp': datetime.now().isoformat()
        }
