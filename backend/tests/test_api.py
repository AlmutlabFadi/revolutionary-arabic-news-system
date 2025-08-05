import pytest
from app import create_app
from src.models.database import db

@pytest.fixture
def app():
    app, socketio = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

class TestHealthEndpoint:
    def test_health_check(self, client):
        response = client.get('/api/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
        assert 'version' in data

class TestNewsAPI:
    def test_get_articles(self, client):
        response = client.get('/api/news/articles')
        assert response.status_code == 200
        data = response.get_json()
        assert 'articles' in data
        assert 'pagination' in data

    def test_get_breaking_news(self, client):
        response = client.get('/api/news/articles/breaking')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_trending_news(self, client):
        response = client.get('/api/news/articles/trending')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_stats(self, client):
        response = client.get('/api/news/stats')
        assert response.status_code == 200
        data = response.get_json()
        assert 'total_articles' in data
        assert 'today_articles' in data
        assert 'total_views' in data
        assert 'active_sources' in data

class TestAutomationAPI:
    def test_get_automation_status(self, client):
        response = client.get('/api/automation/status')
        assert response.status_code == 200
        data = response.get_json()
        assert 'is_running' in data

    def test_toggle_automation(self, client):
        response = client.post('/api/automation/toggle')
        assert response.status_code == 200
        data = response.get_json()
        assert 'is_running' in data
        assert 'message' in data

class TestAnalyticsAPI:
    def test_get_analytics(self, client):
        response = client.get('/api/analytics/')
        assert response.status_code == 200
        data = response.get_json()
        assert 'overview' in data
        assert 'chartData' in data
        assert 'categoryData' in data

    def test_get_analytics_with_time_range(self, client):
        response = client.get('/api/analytics/?time_range=24hours')
        assert response.status_code == 200
        data = response.get_json()
        assert 'overview' in data

class TestPresenterAPI:
    def test_get_presenters(self, client):
        response = client.get('/api/presenter/presenters')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, dict)

    def test_generate_bulletin(self, client):
        response = client.post('/api/presenter/generate-bulletin', 
                             json={'language': 'ar', 'bulletin_type': 'regular'})
        assert response.status_code == 200
        data = response.get_json()
        assert 'id' in data
        assert 'script' in data

    def test_get_bulletin_history(self, client):
        response = client.get('/api/presenter/bulletins')
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
