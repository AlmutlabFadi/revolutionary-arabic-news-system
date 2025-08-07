from datetime import datetime
from enum import Enum
from .database import db

class AdType(Enum):
    BANNER = 'banner'
    VIDEO = 'video'
    POPUP = 'popup'
    NATIVE = 'native'
    ANIMATED = 'animated'
    INTERSTITIAL = 'interstitial'

class AdStatus(Enum):
    ACTIVE = 'active'
    PAUSED = 'paused'
    EXPIRED = 'expired'
    DRAFT = 'draft'
    SCHEDULED = 'scheduled'

class AdFrequency(Enum):
    ONCE = 'once'
    HOURLY = 'hourly'
    DAILY = 'daily'
    CUSTOM = 'custom'

class Advertisement(db.Model):
    __tablename__ = 'advertisements'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    advertiser_name = db.Column(db.String(100))
    advertiser_contact = db.Column(db.String(200))
    
    ad_type = db.Column(db.Enum(AdType), nullable=False)
    image_url = db.Column(db.String(500))
    video_url = db.Column(db.String(500))
    click_url = db.Column(db.String(500))
    
    image_width = db.Column(db.Integer)
    image_height = db.Column(db.Integer)
    video_duration = db.Column(db.Integer)
    file_size = db.Column(db.Integer)
    
    frequency = db.Column(db.Enum(AdFrequency), default=AdFrequency.DAILY)
    times_per_day = db.Column(db.Integer, default=1)
    duration_seconds = db.Column(db.Integer, default=30)
    show_between_bulletins = db.Column(db.Boolean, default=False)
    
    min_video_duration = db.Column(db.Integer, default=5)
    max_video_duration = db.Column(db.Integer, default=300)
    allow_skip = db.Column(db.Boolean, default=True)
    skip_after_seconds = db.Column(db.Integer, default=5)
    
    target_audience = db.Column(db.String(100))
    target_categories = db.Column(db.JSON)
    target_time_slots = db.Column(db.JSON)
    
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    specific_hours = db.Column(db.JSON)
    daily_budget = db.Column(db.Float)
    total_budget = db.Column(db.Float)
    
    impressions = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    conversions = db.Column(db.Integer, default=0)
    total_duration_watched = db.Column(db.Integer, default=0)
    skip_rate = db.Column(db.Float, default=0.0)
    
    status = db.Column(db.Enum(AdStatus), default=AdStatus.DRAFT)
    priority = db.Column(db.Integer, default=1)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'advertiser_name': self.advertiser_name,
            'advertiser_contact': self.advertiser_contact,
            'ad_type': self.ad_type.value if self.ad_type else None,
            'image_url': self.image_url,
            'video_url': self.video_url,
            'click_url': self.click_url,
            'image_width': self.image_width,
            'image_height': self.image_height,
            'video_duration': self.video_duration,
            'file_size': self.file_size,
            'frequency': self.frequency.value if self.frequency else None,
            'times_per_day': self.times_per_day,
            'duration_seconds': self.duration_seconds,
            'show_between_bulletins': self.show_between_bulletins,
            'min_video_duration': self.min_video_duration,
            'max_video_duration': self.max_video_duration,
            'allow_skip': self.allow_skip,
            'skip_after_seconds': self.skip_after_seconds,
            'target_audience': self.target_audience,
            'target_categories': self.target_categories,
            'target_time_slots': self.target_time_slots,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'specific_hours': self.specific_hours,
            'daily_budget': self.daily_budget,
            'total_budget': self.total_budget,
            'impressions': self.impressions,
            'clicks': self.clicks,
            'conversions': self.conversions,
            'total_duration_watched': self.total_duration_watched,
            'skip_rate': self.skip_rate,
            'status': self.status.value if self.status else None,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Sponsor(db.Model):
    __tablename__ = 'sponsors'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    logo_url = db.Column(db.String(500))
    website_url = db.Column(db.String(500))
    contact_email = db.Column(db.String(200))
    contact_phone = db.Column(db.String(50))
    
    sponsorship_type = db.Column(db.String(100))
    sponsorship_amount = db.Column(db.Float)
    contract_start = db.Column(db.DateTime)
    contract_end = db.Column(db.DateTime)
    
    show_in_header = db.Column(db.Boolean, default=False)
    show_in_footer = db.Column(db.Boolean, default=True)
    show_in_sidebar = db.Column(db.Boolean, default=False)
    display_priority = db.Column(db.Integer, default=1)
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'logo_url': self.logo_url,
            'website_url': self.website_url,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'sponsorship_type': self.sponsorship_type,
            'sponsorship_amount': self.sponsorship_amount,
            'contract_start': self.contract_start.isoformat() if self.contract_start else None,
            'contract_end': self.contract_end.isoformat() if self.contract_end else None,
            'show_in_header': self.show_in_header,
            'show_in_footer': self.show_in_footer,
            'show_in_sidebar': self.show_in_sidebar,
            'display_priority': self.display_priority,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
