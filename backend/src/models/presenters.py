from datetime import datetime
from enum import Enum
from .database import db

class PresenterLanguage(Enum):
    ARABIC = "ar"
    ENGLISH = "en"
    GERMAN = "de"
    TURKISH = "tr"

class PresenterSpecialty(Enum):
    POLITICS = "politics"
    ECONOMY = "economy"
    SPORTS = "sports"
    TECHNOLOGY = "technology"
    HEALTH = "health"
    CULTURE = "culture"
    INTERNATIONAL = "international"
    BREAKING_NEWS = "breaking_news"

class VirtualPresenter(db.Model):
    __tablename__ = 'virtual_presenters'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    language = db.Column(db.Enum(PresenterLanguage), nullable=False)
    specialty = db.Column(db.Enum(PresenterSpecialty), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    avatar_image_url = db.Column(db.String(500))
    avatar_video_url = db.Column(db.String(500))
    voice_id = db.Column(db.String(100))
    voice_sample_url = db.Column(db.String(500))
    personality_traits = db.Column(db.Text)
    animation_style = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    supports_emotions = db.Column(db.Boolean, default=True)
    supports_gestures = db.Column(db.Boolean, default=True)
    supports_lip_sync = db.Column(db.Boolean, default=True)
