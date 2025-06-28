from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import hashlib

db = SQLAlchemy()

class Challenge(db.Model):
    __tablename__ = 'challenges'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)  # Easy, Medium, Hard
    flag_hash = db.Column(db.String(64), nullable=False)  # SHA-256 hash
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    content = db.Column(db.Text, nullable=True)  # New field for challenge content
    
    def __repr__(self):
        return f'<Challenge {self.id}: {self.title}>'
    
    @staticmethod
    def hash_flag(flag):
        """Hash a flag using SHA-256"""
        return hashlib.sha256(flag.encode()).hexdigest()
    
    def check_flag(self, submitted_flag):
        """Check if submitted flag matches the stored hash, allowing both 'flag{...}' and 'Flag{...}'"""
        if submitted_flag.lower().startswith('flag{'):
            normalized_flag = 'flag{' + submitted_flag[5:]
        else:
            normalized_flag = submitted_flag
        return self.flag_hash == self.hash_flag(normalized_flag) 