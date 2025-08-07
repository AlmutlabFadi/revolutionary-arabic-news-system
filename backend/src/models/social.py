from datetime import datetime
from enum import Enum
from .database import db

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey('news_articles.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    user_email = db.Column(db.String(200))
    content = db.Column(db.Text, nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    
    article = db.relationship('NewsArticle', backref='comments')
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]))
    
    def to_dict(self):
        return {
            'id': self.id,
            'article_id': self.article_id,
            'user_name': self.user_name,
            'user_email': self.user_email,
            'content': self.content,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'parent_id': self.parent_id,
            'replies': [reply.to_dict() for reply in self.replies] if self.replies else []
        }

class SocialMediaPlatform(db.Model):
    __tablename__ = 'social_media_platforms'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    platform_type = db.Column(db.String(50), nullable=False)
    icon_url = db.Column(db.String(500))
    profile_url = db.Column(db.String(500))
    
    api_key = db.Column(db.String(500))
    api_secret = db.Column(db.String(500))
    access_token = db.Column(db.String(1000))
    
    auto_post_enabled = db.Column(db.Boolean, default=False)
    post_delay_minutes = db.Column(db.Integer, default=0)
    include_image = db.Column(db.Boolean, default=True)
    include_link = db.Column(db.Boolean, default=True)
    custom_hashtags = db.Column(db.Text)
    
    is_active = db.Column(db.Boolean, default=True)
    last_post_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'platform_type': self.platform_type,
            'icon_url': self.icon_url,
            'profile_url': self.profile_url,
            'auto_post_enabled': self.auto_post_enabled,
            'post_delay_minutes': self.post_delay_minutes,
            'include_image': self.include_image,
            'include_link': self.include_link,
            'custom_hashtags': self.custom_hashtags,
            'is_active': self.is_active,
            'last_post_at': self.last_post_at.isoformat() if self.last_post_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class NewsletterSubscription(db.Model):
    __tablename__ = 'newsletter_subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), nullable=False, unique=True)
    name = db.Column(db.String(100))
    
    daily_digest = db.Column(db.Boolean, default=True)
    breaking_news = db.Column(db.Boolean, default=True)
    weekly_summary = db.Column(db.Boolean, default=False)
    category_preferences = db.Column(db.JSON)
    
    is_active = db.Column(db.Boolean, default=True)
    confirmed_at = db.Column(db.DateTime)
    unsubscribed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'daily_digest': self.daily_digest,
            'breaking_news': self.breaking_news,
            'weekly_summary': self.weekly_summary,
            'category_preferences': self.category_preferences,
            'is_active': self.is_active,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None,
            'unsubscribed_at': self.unsubscribed_at.isoformat() if self.unsubscribed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PublicOpinionCampaign(db.Model):
    __tablename__ = 'public_opinion_campaigns'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    target_audience = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    priority = db.Column(db.Integer, default=1)
    
    target_categories = db.Column(db.JSON)
    target_demographics = db.Column(db.JSON)
    geographic_targeting = db.Column(db.JSON)
    
    impressions = db.Column(db.Integer, default=0)
    engagement_rate = db.Column(db.Float, default=0.0)
    sentiment_score = db.Column(db.Float, default=0.0)
    
    is_active = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'target_audience': self.target_audience,
            'message': self.message,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'priority': self.priority,
            'target_categories': self.target_categories,
            'target_demographics': self.target_demographics,
            'geographic_targeting': self.geographic_targeting,
            'impressions': self.impressions,
            'engagement_rate': self.engagement_rate,
            'sentiment_score': self.sentiment_score,
            'is_active': self.is_active,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ContactInquiry(db.Model):
    __tablename__ = 'contact_inquiries'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50))
    
    inquiry_type = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    
    status = db.Column(db.String(50), default='new')
    priority = db.Column(db.String(20), default='normal')
    assigned_to = db.Column(db.String(100))
    
    response = db.Column(db.Text)
    responded_at = db.Column(db.DateTime)
    responded_by = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'inquiry_type': self.inquiry_type,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'priority': self.priority,
            'assigned_to': self.assigned_to,
            'response': self.response,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
            'responded_by': self.responded_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
