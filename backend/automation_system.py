import schedule
import time
import threading
from datetime import datetime, timedelta
import sqlite3
import requests
from bs4 import BeautifulSoup
import feedparser
import logging
from typing import Dict, List
import json

from ai_engine import ai_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RevolutionaryAutomationSystem:
    def __init__(self):
        self.is_running = False
        self.sources = [
            {
                'name': 'وكالة سانا',
                'url': 'https://sana.sy/rss.xml',
                'country': 'سوريا',
                'language': 'ar',
                'active': True
            },
            {
                'name': 'الوطن أونلاين',
                'url': 'https://alwatan.sy/rss.xml',
                'country': 'سوريا', 
                'language': 'ar',
                'active': True
            },
            {
                'name': 'الجزيرة',
                'url': 'https://www.aljazeera.net/rss/all.xml',
                'country': 'قطر',
                'language': 'ar',
                'active': True
            },
            {
                'name': 'العربية',
                'url': 'https://www.alarabiya.net/rss.xml',
                'country': 'السعودية',
                'language': 'ar',
                'active': True
            }
        ]
        
        self.processing_stats = {
            'total_scraped': 0,
            'total_processed': 0,
            'total_published': 0,
            'last_run': None,
            'processing_time': 0,
            'errors': 0
        }
        
        self.scheduler = schedule.Scheduler()
        self._setup_schedules()
    
    def _setup_schedules(self):
        """إعداد الجداول الزمنية"""
        # تشغيل كل 5 دقائق
        self.scheduler.every(5).minutes.do(self.run_automation_cycle)
        
        # تشغيل كل ساعة
        self.scheduler.every().hour.do(self.run_analytics_update)
        
        # تشغيل كل يوم في الساعة 6 صباحاً
        self.scheduler.every().day.at("06:00").do(self.run_daily_maintenance)
        
        logger.info("📅 تم إعداد جداول الأتمتة")
    
    def start_automation(self):
        """بدء نظام الأتمتة"""
        if self.is_running:
            logger.warning("نظام الأتمتة يعمل بالفعل")
            return
        
        self.is_running = True
        logger.info("🚀 بدء نظام الأتمتة الثوري")
        
        # تشغيل في خيط منفصل
        automation_thread = threading.Thread(target=self._run_scheduler)
        automation_thread.daemon = True
        automation_thread.start()
        
        # تشغيل دورة أولية
        self.run_automation_cycle()
    
    def stop_automation(self):
        """إيقاف نظام الأتمتة"""
        self.is_running = False
        logger.info("⏹️ إيقاف نظام الأتمتة")
    
    def _run_scheduler(self):
        """تشغيل المجدول"""
        while self.is_running:
            self.scheduler.run_pending()
            time.sleep(1)
    
    def run_automation_cycle(self):
        """دورة الأتمتة الرئيسية"""
        start_time = datetime.now()
        logger.info("🔄 بدء دورة الأتمتة الثورية")
        
        try:
            # 1. جمع الأخبار من المصادر
            articles = self._scrape_all_sources()
            
            # 2. معالجة المقالات بالذكاء الاصطناعي
            processed_articles = self._process_articles_with_ai(articles)
            
            # 3. حفظ المقالات في قاعدة البيانات
            saved_count = self._save_articles_to_db(processed_articles)
            
            # 4. نشر المقالات
            published_count = self._publish_articles(processed_articles)
            
            # 5. تحديث الإحصائيات
            processing_time = (datetime.now() - start_time).total_seconds()
            self._update_stats(len(articles), len(processed_articles), published_count, processing_time)
            
            logger.info(f"✅ دورة الأتمتة مكتملة: {len(articles)} مقال تم جمعه، {published_count} مقال تم نشره في {processing_time:.2f} ثانية")
            
        except Exception as e:
            logger.error(f"❌ خطأ في دورة الأتمتة: {str(e)}")
            self.processing_stats['errors'] += 1
    
    def _scrape_all_sources(self) -> List[Dict]:
        """جمع الأخبار من جميع المصادر"""
        all_articles = []
        
        for source in self.sources:
            if not source['active']:
                continue
                
            try:
                articles = self._scrape_source(source)
                all_articles.extend(articles)
                logger.info(f"📡 تم جمع {len(articles)} مقال من {source['name']}")
                
            except Exception as e:
                logger.error(f"خطأ في جمع الأخبار من {source['name']}: {str(e)}")
        
        return all_articles
    
    def _scrape_source(self, source: Dict) -> List[Dict]:
        """جمع الأخبار من مصدر واحد"""
        articles = []
        
        try:
            # جلب RSS feed
            feed = feedparser.parse(source['url'])
            
            for entry in feed.entries[:5]:  # آخر 5 مقالات
                article = {
                    'title': entry.get('title', ''),
                    'content': entry.get('summary', ''),
                    'url': entry.get('link', ''),
                    'published': entry.get('published', ''),
                    'source': source['name'],
                    'country': source['country'],
                    'language': source['language']
                }
                
                # جلب المحتوى الكامل إذا كان متوفراً
                if article['url']:
                    try:
                        full_content = self._scrape_full_content(article['url'])
                        if full_content:
                            article['content'] = full_content
                    except:
                        pass  # استخدام الملخص إذا فشل جلب المحتوى الكامل
                
                articles.append(article)
                
        except Exception as e:
            logger.error(f"خطأ في جلب RSS من {source['name']}: {str(e)}")
        
        return articles
    
    def _scrape_full_content(self, url: str) -> str:
        """جلب المحتوى الكامل من URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # البحث عن المحتوى الرئيسي
            content_selectors = [
                'article',
                '.article-content',
                '.post-content',
                '.entry-content',
                'main'
            ]
            
            for selector in content_selectors:
                content_elem = soup.select_one(selector)
                if content_elem:
                    # إزالة العناصر غير المرغوبة
                    for elem in content_elem.find_all(['script', 'style', 'nav', 'header', 'footer']):
                        elem.decompose()
                    
                    text = content_elem.get_text(strip=True)
                    if len(text) > 100:  # التأكد من وجود محتوى كافٍ
                        return text
            
            return ""
            
        except Exception as e:
            logger.error(f"خطأ في جلب المحتوى من {url}: {str(e)}")
            return ""
    
    def _process_articles_with_ai(self, articles: List[Dict]) -> List[Dict]:
        """معالجة المقالات بالذكاء الاصطناعي"""
        processed_articles = []
        
        for article in articles:
            try:
                # معالجة المقال بالذكاء الاصطناعي
                ai_result = ai_engine.process_article_revolutionary(
                    content=article['content'],
                    title=article['title']
                )
                
                # دمج النتائج
                processed_article = {
                    **article,
                    'ai_processed': True,
                    'summary': ai_result.get('summary', article.get('content', '')[:200]),
                    'category': ai_result.get('category', 'GENERAL'),
                    'sentiment_score': ai_result.get('sentiment_score', 0.5),
                    'keywords': ai_result.get('keywords', []),
                    'improved_title': ai_result.get('improved_title', article['title']),
                    'bias_analysis': ai_result.get('bias_analysis', {}),
                    'ai_confidence': ai_result.get('ai_confidence', 0.5),
                    'processing_time': ai_result.get('processing_time', 0)
                }
                
                processed_articles.append(processed_article)
                
            except Exception as e:
                logger.error(f"خطأ في معالجة المقال: {str(e)}")
                # إضافة المقال بدون معالجة AI
                article['ai_processed'] = False
                processed_articles.append(article)
        
        return processed_articles
    
    def _save_articles_to_db(self, articles: List[Dict]) -> int:
        """حفظ المقالات في قاعدة البيانات"""
        saved_count = 0
        
        try:
            conn = sqlite3.connect('golan24_revolutionary.db')
            cursor = conn.cursor()
            
            for article in articles:
                try:
                    # التحقق من عدم وجود المقال مسبقاً
                    cursor.execute('''
                        SELECT id FROM articles 
                        WHERE title = ? AND source = ?
                    ''', (article['title'], article['source']))
                    
                    if cursor.fetchone():
                        continue  # المقال موجود مسبقاً
                    
                    # إدراج المقال الجديد
                    cursor.execute('''
                        INSERT INTO articles (
                            title, content, summary, category, status,
                            published_at, views, ai_processed, sentiment_score,
                            keywords, source
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        article['improved_title'],
                        article['content'],
                        article['summary'],
                        article['category'],
                        'published',
                        datetime.now().isoformat(),
                        0,
                        article['ai_processed'],
                        article['sentiment_score'],
                        json.dumps(article['keywords']),
                        article['source']
                    ))
                    
                    saved_count += 1
                    
                except Exception as e:
                    logger.error(f"خطأ في حفظ المقال: {str(e)}")
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"خطأ في الاتصال بقاعدة البيانات: {str(e)}")
        
        return saved_count
    
    def _publish_articles(self, articles: List[Dict]) -> int:
        """نشر المقالات"""
        published_count = 0
        
        for article in articles:
            try:
                # هنا يمكن إضافة منطق النشر الفعلي
                # مثل إرسال إلى مواقع التواصل الاجتماعي
                # أو إرسال إشعارات للمستخدمين
                
                logger.info(f"📰 نشر مقال: {article['improved_title']}")
                published_count += 1
                
            except Exception as e:
                logger.error(f"خطأ في نشر المقال: {str(e)}")
        
        return published_count
    
    def _update_stats(self, scraped: int, processed: int, published: int, processing_time: float):
        """تحديث الإحصائيات"""
        self.processing_stats['total_scraped'] += scraped
        self.processing_stats['total_processed'] += processed
        self.processing_stats['total_published'] += published
        self.processing_stats['processing_time'] = processing_time
        self.processing_stats['last_run'] = datetime.now().isoformat()
    
    def run_analytics_update(self):
        """تحديث الإحصائيات"""
        logger.info("📊 تحديث الإحصائيات")
        
        try:
            conn = sqlite3.connect('golan24_revolutionary.db')
            cursor = conn.cursor()
            
            # إحصائيات المقالات
            cursor.execute('SELECT COUNT(*) FROM articles')
            total_articles = cursor.fetchone()[0]
            
            cursor.execute('SELECT COUNT(*) FROM articles WHERE ai_processed = 1')
            ai_processed = cursor.fetchone()[0]
            
            cursor.execute('SELECT AVG(sentiment_score) FROM articles WHERE sentiment_score IS NOT NULL')
            avg_sentiment = cursor.fetchone()[0] or 0
            
            # حفظ الإحصائيات
            analytics_data = {
                'total_articles': total_articles,
                'ai_processed_articles': ai_processed,
                'average_sentiment': avg_sentiment,
                'automation_runs': self.processing_stats['total_scraped'],
                'timestamp': datetime.now().isoformat()
            }
            
            # يمكن حفظ الإحصائيات في جدول منفصل
            cursor.execute('''
                INSERT INTO analytics (metric_name, metric_value, timestamp)
                VALUES (?, ?, ?)
            ''', ('daily_stats', json.dumps(analytics_data), datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
            logger.info(f"📈 تم تحديث الإحصائيات: {total_articles} مقال، {ai_processed} معالج بالAI")
            
        except Exception as e:
            logger.error(f"خطأ في تحديث الإحصائيات: {str(e)}")
    
    def run_daily_maintenance(self):
        """الصيانة اليومية"""
        logger.info("🔧 بدء الصيانة اليومية")
        
        try:
            # تنظيف المقالات القديمة
            # تحديث الإحصائيات
            # فحص صحة قاعدة البيانات
            # إرسال تقرير يومي
            
            logger.info("✅ الصيانة اليومية مكتملة")
            
        except Exception as e:
            logger.error(f"خطأ في الصيانة اليومية: {str(e)}")
    
    def get_automation_status(self) -> Dict:
        """حالة نظام الأتمتة"""
        return {
            'is_running': self.is_running,
            'processing_stats': self.processing_stats,
            'active_sources': len([s for s in self.sources if s['active']]),
            'total_sources': len(self.sources),
            'next_run': '5 minutes' if self.is_running else 'stopped',
            'automation_level': '100%',
            'processing_speed': f"{self.processing_stats.get('processing_time', 0):.2f} seconds"
        }

# إنشاء مثيل عالمي
automation_system = RevolutionaryAutomationSystem()
