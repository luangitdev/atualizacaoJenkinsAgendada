from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ScheduledJob(db.Model):
    __tablename__ = 'scheduled_jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    app_name = db.Column(db.String(100), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    target_server = db.Column(db.String(100), nullable=False)
    app_branch = db.Column(db.String(50), nullable=False)
    skip_clone = db.Column(db.Boolean, default=True)
    skip_build = db.Column(db.Boolean, default=False)
    schedule_date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    schedule_time = db.Column(db.String(5), nullable=False)   # HH:MM
    jenkins_url = db.Column(db.String(200), nullable=False)
    jenkins_user = db.Column(db.String(100), nullable=False)
    jenkins_token = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to job history
    history = db.relationship('JobHistory', backref='job', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'app_name': self.app_name,
            'version': self.version,
            'target_server': self.target_server,
            'app_branch': self.app_branch,
            'skip_clone': self.skip_clone,
            'skip_build': self.skip_build,
            'schedule_date': self.schedule_date,
            'schedule_time': self.schedule_time,
            'jenkins_url': self.jenkins_url,
            'jenkins_user': self.jenkins_user,
            'jenkins_token': self.jenkins_token,  # Note: In production, this should be encrypted
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class JobHistory(db.Model):
    __tablename__ = 'job_history'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('scheduled_jobs.id'), nullable=False)
    execution_time = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), nullable=False)  # success, failed
    response_text = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'job_id': self.job_id,
            'execution_time': self.execution_time.isoformat() if self.execution_time else None,
            'status': self.status,
            'response_text': self.response_text
        }