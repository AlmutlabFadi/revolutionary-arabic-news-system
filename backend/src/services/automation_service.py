import time
import threading
import schedule
from datetime import datetime, timedelta
import logging
from typing import Dict, List
import json
import hashlib

from ..services.news_scraper import NewsScraper, NewsArticleData
from .ai_processor import MultiAIProcessor
from ..services.performance_monitor import performance_monitor
from ..models.database import db
from ..models.news import NewsArticle, NewsSource, NewsCategory, NewsStatus, ScrapingLog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AutomationService:
    def __init__(self, app=None):
        self.app = app
        self.scraper = NewsScraper()
        self.ai_processor = MultiAIProcessor()
        self.is_running = False
        self.automation_thread = None
        
        self.scraping_interval = 5
        self.max_articles_per_source = 10
        self.auto_publish = True
        self.ai_processing_enabled = True
        
        self.stats = {
            "total_scraped": 0,
            "total_processed": 0,
            "total_published": 0,
            "last_run": None,
            "errors": 0
        }

    def generate_article_hash(self, title: str, content: str) -> str:
        content_hash = hashlib.md5((title + content).encode('utf-8')).hexdigest()
        return content_hash

    def article_exists(self, article_hash: str) -> bool:
        if not self.app:
            return False
        with self.app.app_context():
            existing = NewsArticle.query.filter_by(content_hash=article_hash).first()
            return existing is not None

    def get_or_create_source(self, source_name: str, source_url: str, language: str, country: str) -> NewsSource:
        if not self.app:
            return None
        with self.app.app_context():
            source = NewsSource.query.filter_by(name=source_name).first()
            
            if not source:
                source = NewsSource(
                    name=source_name,
                    url=source_url,
                    language=language,
                    country=country,
                    is_active=True
                )
                db.session.add(source)
                db.session.commit()
                logger.info(f"Created new source: {source_name}")
            
            return source

    def save_article_to_db(self, article_data: NewsArticleData, ai_results: Dict, source: NewsSource) -> bool:
        try:
            if not self.app:
                return False
            with self.app.app_context():
                article_hash = self.generate_article_hash(article_data.title, article_data.content)
                
                if self.article_exists(article_hash):
                    logger.info(f"Article already exists: {article_data.title[:50]}...")
                    return False
                
                category_str = ai_results.get('category', article_data.category)
                try:
                    category = NewsCategory(category_str.lower().replace(' ', '_'))
                except (ValueError, AttributeError):
                    category = NewsCategory.GENERAL
                
                status = NewsStatus.PUBLISHED if self.auto_publish else NewsStatus.DRAFT
                
                article = NewsArticle(
                    title=article_data.title,
                    content=article_data.content,
                    summary=ai_results.get('summary', article_data.summary),
                    original_url=article_data.url,
                    image_url=article_data.image_url,
                    author=article_data.author,
                    category=category,
                    status=status,
                    source_id=source.id,
                    published_at=article_data.published_at or datetime.now(),
                    scraped_at=datetime.now(),
                    content_hash=article_hash,
                    ai_processed=True,
                    ai_summary=ai_results.get('summary'),
                    ai_tags=json.dumps(ai_results.get('tags', []), ensure_ascii=False),
                    sentiment_score=ai_results.get('sentiment_score')
                )
                
                db.session.add(article)
                db.session.commit()
                
                logger.info(f"Saved article: {article_data.title[:50]}...")
                return True
                
        except Exception as e:
            logger.error(f"Error saving article: {str(e)}")
            if self.app:
                with self.app.app_context():
                    db.session.rollback()
            return False

    def log_scraping_activity(self, source_name: str, articles_found: int, articles_saved: int, errors: int = 0):
        try:
            if not self.app:
                return
            with self.app.app_context():
                log_entry = ScrapingLog(
                    source_name=source_name,
                    articles_found=articles_found,
                    articles_saved=articles_saved,
                    errors=errors,
                    scraped_at=datetime.now()
                )
                
                db.session.add(log_entry)
                db.session.commit()
                
        except Exception as e:
            logger.error(f"Error logging activity: {str(e)}")

    @performance_monitor.time_function('process_single_source')
    def process_single_source(self, source_key: str) -> Dict:
        logger.info(f"Processing source: {source_key}")
        
        results = {
            "source": source_key,
            "articles_found": 0,
            "articles_processed": 0,
            "articles_saved": 0,
            "errors": 0
        }
        
        try:
            articles = self.scraper.scrape_source(source_key)
            results["articles_found"] = len(articles)
            
            if not articles:
                logger.warning(f"No articles found from {source_key}")
                return results
            
            source_config = self.scraper.news_sources[source_key]
            source = self.get_or_create_source(
                source_config['name'],
                source_config['base_url'],
                source_config['language'],
                source_config['country']
            )
            
            for article_data in articles[:self.max_articles_per_source]:
                try:
                    ai_results = {}
                    if self.ai_processing_enabled and article_data.content:
                        ai_results = self.ai_processor.process_article_complete(
                            article_data.title,
                            article_data.content
                        )
                        results["articles_processed"] += 1
                    
                    if self.save_article_to_db(article_data, ai_results, source):
                        results["articles_saved"] += 1
                        self.stats["total_published"] += 1
                    
                    time.sleep(1)
                    
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
                    results["errors"] += 1
                    self.stats["errors"] += 1
            
            self.log_scraping_activity(
                source_config['name'],
                results["articles_found"],
                results["articles_saved"],
                results["errors"]
            )
            
        except Exception as e:
            logger.error(f"Error processing source {source_key}: {str(e)}")
            results["errors"] += 1
            self.stats["errors"] += 1
        
        return results

    @performance_monitor.time_function('run_full_scraping_cycle')
    def run_full_scraping_cycle(self):
        logger.info("Starting full scraping cycle")
        start_time = datetime.now()
        
        total_results = {
            "cycle_start": start_time.isoformat(),
            "sources_processed": 0,
            "total_articles_found": 0,
            "total_articles_saved": 0,
            "total_errors": 0,
            "source_results": {}
        }
        
        for source_key in self.scraper.news_sources.keys():
            try:
                source_results = self.process_single_source(source_key)
                total_results["source_results"][source_key] = source_results
                
                total_results["sources_processed"] += 1
                total_results["total_articles_found"] += source_results["articles_found"]
                total_results["total_articles_saved"] += source_results["articles_saved"]
                total_results["total_errors"] += source_results["errors"]
                
                time.sleep(10)
                
            except Exception as e:
                logger.error(f"Error processing source {source_key}: {str(e)}")
                total_results["total_errors"] += 1
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        total_results["cycle_end"] = end_time.isoformat()
        total_results["duration_seconds"] = duration
        
        self.stats["total_scraped"] += total_results["total_articles_found"]
        self.stats["total_processed"] += total_results["total_articles_saved"]
        self.stats["last_run"] = end_time.isoformat()
        
        logger.info(f"Scraping cycle completed - Found {total_results['total_articles_found']} articles, saved {total_results['total_articles_saved']} articles")
        
        return total_results

    def schedule_automation(self):
        logger.info(f"Scheduling news scraping every {self.scraping_interval} minutes")
        
        schedule.every(self.scraping_interval).minutes.do(self.run_full_scraping_cycle)
        
        self.run_full_scraping_cycle()
        
        while self.is_running:
            schedule.run_pending()
            time.sleep(60)

    def start_automation(self):
        if self.is_running:
            logger.warning("Automation is already running")
            return
        
        logger.info("Starting news automation service")
        self.is_running = True
        
        self.automation_thread = threading.Thread(target=self.schedule_automation)
        self.automation_thread.daemon = True
        self.automation_thread.start()

    def stop_automation(self):
        logger.info("Stopping news automation service")
        self.is_running = False
        
        if self.automation_thread:
            self.automation_thread.join(timeout=5)

    def get_automation_status(self) -> Dict:
        return {
            "is_running": self.is_running,
            "scraping_interval": self.scraping_interval,
            "auto_publish": self.auto_publish,
            "ai_processing_enabled": self.ai_processing_enabled,
            "stats": self.stats,
            "sources_count": len(self.scraper.news_sources)
        }

    def manual_scrape_source(self, source_key: str) -> Dict:
        logger.info(f"Manual scraping from source: {source_key}")
        return self.process_single_source(source_key)

    def update_settings(self, settings: Dict):
        if "scraping_interval" in settings:
            self.scraping_interval = max(1, settings["scraping_interval"])
        
        if "auto_publish" in settings:
            self.auto_publish = settings["auto_publish"]
        
        if "ai_processing_enabled" in settings:
            self.ai_processing_enabled = settings["ai_processing_enabled"]
        
        if "max_articles_per_source" in settings:
            self.max_articles_per_source = max(1, settings["max_articles_per_source"])
        
        logger.info("Automation settings updated")
