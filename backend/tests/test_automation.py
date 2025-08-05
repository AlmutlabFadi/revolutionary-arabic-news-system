import pytest
import time
from datetime import datetime
from src.services.automation_service import AutomationService
from src.services.news_scraper import NewsScraper, NewsArticleData
from src.services.ai_processor import AINewsProcessor

class TestAutomationService:
    def test_automation_service_initialization(self):
        service = AutomationService()
        assert service is not None
        assert service.scraping_interval == 5
        assert service.max_articles_per_source == 10
        assert service.auto_publish == True
        assert service.ai_processing_enabled == True

    def test_article_hash_generation(self):
        service = AutomationService()
        title = "Test Article Title"
        content = "Test article content"
        hash1 = service.generate_article_hash(title, content)
        hash2 = service.generate_article_hash(title, content)
        assert hash1 == hash2
        assert len(hash1) == 32

    def test_processing_time_under_60_seconds(self):
        """Test that article processing completes within 60 seconds"""
        service = AutomationService()
        ai_processor = AINewsProcessor()
        
        article_data = NewsArticleData()
        article_data.title = "Test News Article"
        article_data.content = "This is a test news article content for timing test."
        article_data.url = "https://example.com/test"
        article_data.published_at = datetime.now()
        
        start_time = time.time()
        
        ai_results = ai_processor.process_article_complete(
            article_data.title, 
            article_data.content
        )
        
        processing_time = time.time() - start_time
        
        assert processing_time < 60, f"Processing took {processing_time:.2f} seconds, exceeding 60 second limit"
        assert ai_results is not None
        assert 'processing_time' in ai_results

class TestNewsScraper:
    def test_news_scraper_initialization(self):
        scraper = NewsScraper()
        assert scraper is not None
        assert len(scraper.news_sources) > 0

    def test_categorization_speed(self):
        """Test that article categorization is fast"""
        scraper = NewsScraper()
        test_text = "سياسة الحكومة السورية في دمشق"
        
        start_time = time.time()
        category = scraper.categorize_article(test_text)
        categorization_time = time.time() - start_time
        
        assert categorization_time < 1, f"Categorization took {categorization_time:.2f} seconds"
        assert category in ['politics', 'syrian_affairs', 'general']

class TestAIProcessor:
    def test_ai_processor_initialization(self):
        processor = AINewsProcessor()
        assert processor is not None

    def test_fallback_categorization_speed(self):
        """Test that fallback categorization is very fast"""
        processor = AINewsProcessor()
        test_text = "اقتصاد سوريا والاستثمار في دمشق"
        
        start_time = time.time()
        category = processor.fallback_categorization(test_text)
        categorization_time = time.time() - start_time
        
        assert categorization_time < 0.1, f"Fallback categorization took {categorization_time:.2f} seconds"
        assert category in ['economy', 'syrian_affairs', 'general']

    def test_keyword_extraction_speed(self):
        """Test that keyword extraction is fast"""
        processor = AINewsProcessor()
        test_text = "الاقتصاد السوري والاستثمار في التكنولوجيا والصحة"
        
        start_time = time.time()
        keywords = processor.extract_keywords_fallback(test_text)
        extraction_time = time.time() - start_time
        
        assert extraction_time < 0.5, f"Keyword extraction took {extraction_time:.2f} seconds"
        assert isinstance(keywords, list)
        assert len(keywords) > 0

class TestEndToEndAutomation:
    def test_complete_automation_pipeline_timing(self):
        """Test that complete automation pipeline meets 60-second requirement"""
        service = AutomationService()
        
        start_time = time.time()
        
        test_articles = []
        for i in range(3):  # Test with 3 articles
            article = NewsArticleData()
            article.title = f"Test Article {i+1}"
            article.content = f"Test content for article {i+1} with sufficient length to test AI processing."
            article.url = f"https://example.com/article-{i+1}"
            article.published_at = datetime.now()
            test_articles.append(article)
        
        ai_processor = AINewsProcessor()
        processed_articles = []
        
        for article in test_articles:
            ai_results = ai_processor.process_article_complete(
                article.title, 
                article.content
            )
            processed_articles.append((article, ai_results))
        
        total_time = time.time() - start_time
        
        assert total_time < 60, f"Complete pipeline took {total_time:.2f} seconds, exceeding 60 second limit"
        assert len(processed_articles) == 3
        
        for article, ai_results in processed_articles:
            assert ai_results is not None
            assert 'processing_time' in ai_results
