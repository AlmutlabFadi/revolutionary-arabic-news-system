from datetime import datetime
from enum import Enum
from .database import db

class AdPosition(Enum):
    HEADER = "header"
    SIDEBAR = "sidebar"
    ARTICLE_TOP = "article_top"
    ARTICLE_BOTTOM = "article_bottom"
    POPUP = "popup"

class Advertisement(db.Model):
    __tablename__ = 'advertisements'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    link_url = db.Column(db.String(500))
    position = db.Column(db.Enum(AdPosition), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    click_count = db.Column(db.Integer, default=0)
    impression_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Sponsor(db.Model):
    __tablename__ = 'sponsors'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    logo_url = db.Column(db.String(500))
    website_url = db.Column(db.String(500))
    contact_email = db.Column(db.String(200))
    contact_phone = db.Column(db.String(50))
    sponsorship_level = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
