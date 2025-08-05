import requests
from bs4 import BeautifulSoup
import feedparser
import time
import logging
from datetime import datetime, timedelta
from urllib.parse import urljoin, urlparse
import re
from typing import List, Dict, Optional
import json
import concurrent.futures
from threading import Lock

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NewsArticleData:
    def __init__(self):
        self.title = ""
        self.content = ""
        self.summary = ""
        self.url = ""
        self.image_url = ""
        self.author = ""
        self.published_at = None
        self.category = ""
        self.source_name = ""

class NewsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.lock = Lock()
        self.max_workers = 8  # Parallel processing
        self.timeout = 5  # Aggressive timeout
        
        self.news_sources = {
            'sana': {
                'name': 'وكالة سانا',
                'rss_url': 'https://sana.sy/rss.xml',
                'base_url': 'https://sana.sy',
                'language': 'ar',
                'country': 'سوريا'
            },
            'aljazeera': {
                'name': 'الجزيرة',
                'rss_url': 'https://www.aljazeera.net/rss/all.xml',
                'base_url': 'https://www.aljazeera.net',
                'language': 'ar',
                'country': 'قطر'
            },
            'alarabiya': {
                'name': 'العربية',
                'rss_url': 'https://www.alarabiya.net/rss.xml',
                'base_url': 'https://www.alarabiya.net',
                'language': 'ar',
                'country': 'السعودية'
            },
            'bbc_arabic': {
                'name': 'BBC Arabic',
                'rss_url': 'https://feeds.bbci.co.uk/arabic/rss.xml',
                'base_url': 'https://www.bbc.com',
                'language': 'ar',
                'country': 'بريطانيا'
            },
            'reuters': {
                'name': 'Reuters',
                'rss_url': 'https://feeds.reuters.com/reuters/topNews',
                'base_url': 'https://www.reuters.com',
                'language': 'en',
                'country': 'أمريكا'
            }
        }

    def fetch_rss_feed(self, rss_url: str) -> List[Dict]:
        try:
            logger.info(f"Fetching RSS from: {rss_url}")
            
            response = self.session.get(rss_url, timeout=self.timeout)
            response.raise_for_status()
            
            feed = feedparser.parse(response.content)
            articles = []
            
            for entry in feed.entries[:3]:
                article = {
                    'title': entry.get('title', ''),
                    'link': entry.get('link', ''),
                    'summary': entry.get('summary', ''),
                    'published': entry.get('published', ''),
                    'author': entry.get('author', '')
                }
                articles.append(article)
            
            logger.info(f"Fetched {len(articles)} articles from RSS")
            return articles
            
        except Exception as e:
            logger.error(f"Error fetching RSS from {rss_url}: {str(e)}")
            return []

    def extract_article_content(self, url: str, source_config: Dict) -> Optional[NewsArticleData]:
        try:
            logger.info(f"Extracting content from: {url}")
            
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            article = NewsArticleData()
            
            title_elem = soup.select_one('h1') or soup.select_one('title')
            if title_elem:
                article.title = title_elem.get_text().strip()
            
            content_elem = soup.select_one('article') or soup.select_one('.article-content')
            if content_elem:
                paragraphs = content_elem.find_all('p')[:3]  # Limit for speed
                content_parts = [p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 20]
                article.content = '\n\n'.join(content_parts)
            
            img_elem = soup.select_one('article img') or soup.select_one('img')
            if img_elem and img_elem.get('src'):
                img_url = img_elem.get('src')
                if isinstance(img_url, str):
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    elif img_url.startswith('/'):
                        img_url = urljoin(source_config['base_url'], img_url)
                    article.image_url = img_url
            
            article.url = url
            article.source_name = source_config['name']
            article.category = self.categorize_article(article.title + " " + article.content)
            
            logger.info(f"Extracted article: {article.title[:50]}...")
            return article
            
        except Exception as e:
            logger.error(f"Error extracting content from {url}: {str(e)}")
            return None

    def categorize_article(self, text: str) -> str:
        text_lower = text.lower()
        
        categories = {
            'politics': ['سياسة', 'حكومة', 'رئيس', 'وزير', 'برلمان', 'انتخابات', 'دبلوماسية', 'مفاوضات'],
            'economy': ['اقتصاد', 'بورصة', 'أسهم', 'استثمار', 'تجارة', 'صادرات', 'واردات', 'عملة'],
            'syrian_affairs': ['سوريا', 'سوري', 'دمشق', 'حلب', 'حمص', 'اللاذقية', 'درعا', 'إعادة إعمار'],
            'sports': ['رياضة', 'كرة', 'فوز', 'هزيمة', 'مباراة', 'بطولة', 'أولمبياد', 'منتخب'],
            'health': ['صحة', 'طب', 'مرض', 'علاج', 'مستشفى', 'طبيب', 'دواء', 'وباء'],
            'technology': ['تقنية', 'تكنولوجيا', 'ذكاء اصطناعي', 'إنترنت', 'هاتف', 'تطبيق', 'برمجة']
        }
        
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return category
        
        return 'general'

    def scrape_source(self, source_key: str) -> List[NewsArticleData]:
        if source_key not in self.news_sources:
            logger.error(f"Unknown source: {source_key}")
            return []
        
        source_config = self.news_sources[source_key]
        logger.info(f"Starting to scrape from: {source_config['name']}")
        
        rss_articles = self.fetch_rss_feed(source_config['rss_url'])
        
        scraped_articles = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_article = {
                executor.submit(self._process_article_fast, rss_article, source_config): rss_article 
                for rss_article in rss_articles[:3]  # Limit for speed
                if rss_article['link']
            }
            
            for future in concurrent.futures.as_completed(future_to_article, timeout=15):
                try:
                    article_data = future.result(timeout=3)
                    if article_data:
                        scraped_articles.append(article_data)
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
                    continue
        
        logger.info(f"Scraped {len(scraped_articles)} articles from {source_config['name']}")
        return scraped_articles
    
    def _process_article_fast(self, rss_article: Dict, source_config: Dict) -> Optional[NewsArticleData]:
        """Revolutionary fast article processing"""
        try:
            article_data = self.extract_article_content(rss_article['link'], source_config)
            if article_data and article_data.content:
                if not article_data.title and rss_article['title']:
                    article_data.title = rss_article['title']
                if not article_data.summary and rss_article['summary']:
                    article_data.summary = rss_article['summary']
                if rss_article['author']:
                    article_data.author = rss_article['author']
                
                if rss_article['published']:
                    try:
                        article_data.published_at = datetime.strptime(
                            rss_article['published'], '%a, %d %b %Y %H:%M:%S %z'
                        )
                    except:
                        article_data.published_at = datetime.now()
                else:
                    article_data.published_at = datetime.now()
                
                return article_data
        except Exception as e:
            logger.error(f"Error processing article: {str(e)}")
            return None

    def scrape_all_sources(self) -> Dict[str, List[NewsArticleData]]:
        """Revolutionary parallel scraping of all sources for <60 second processing"""
        all_articles = {}
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_source = {
                executor.submit(self.scrape_source, source_key): source_key 
                for source_key in self.news_sources.keys()
            }
            
            for future in concurrent.futures.as_completed(future_to_source, timeout=45):
                try:
                    source_key = future_to_source[future]
                    articles = future.result(timeout=10)
                    all_articles[source_key] = articles
                except Exception as e:
                    source_key = future_to_source.get(future, 'unknown')
                    logger.error(f"Error scraping from {source_key}: {str(e)}")
                    all_articles[source_key] = []
        
        return all_articles
