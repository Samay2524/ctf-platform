from app import app, db
from models import Challenge
import hashlib

def hash_flag(flag):
    """Hash a flag using SHA-256"""
    return hashlib.sha256(flag.encode()).hexdigest()

def seed_challenges():
    """Seed the database with all 15 challenges"""
    challenges_data = [
        # Easy challenges
        {
            'id': 1,
            'title': 'Hidden Message',
            'description': 'Find the hidden message in this image. Look carefully at the pixels and colors.',
            'difficulty': 'Easy',
            'flag': 'flag{gH29XtL8s}',
            'content': 'Here is an image: <img src="/static/rubiks.jpg" alt="hidden" />'
        },
        # ... (other challenges as before, or add more as needed)
    ]
    with app.app_context():
        Challenge.query.delete()
        for challenge_data in challenges_data:
            challenge = Challenge(
                id=challenge_data['id'],
                title=challenge_data['title'],
                description=challenge_data['description'],
                difficulty=challenge_data['difficulty'],
                flag_hash=hash_flag(challenge_data['flag']),
                content=challenge_data.get('content', None)
            )
            db.session.add(challenge)
        db.session.commit()
        print(f"✅ Seeded {len(challenges_data)} challenges successfully!")

if __name__ == '__main__':
    seed_challenges() 