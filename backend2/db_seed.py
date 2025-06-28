from app import app, db
from models import Challenge
import hashlib
import logging

def hash_flag(flag):
    """Hash a flag using SHA-256"""
    return hashlib.sha256(flag.encode()).hexdigest()

def seed_challenges():
    """Seed the database with all 16 challenges"""
    
    challenges_data = [
        {
            'id': 1,
            'title': 'Source Sleuth',
            'description': 'The flag is hidden somewhere in the page source. Can you find it?',
            'difficulty': 'Easy',
            'flag': 'flag{v1ewS0urc3}',
            'content': 'Welcome to the CTF! <!-- flag{v1ewS0urc3} -->'
        },
        {
            'id': 2,
            'title': 'Hidden Message',
            'description': 'Find the hidden message in this image. Look carefully at the pixels and colors.',
            'difficulty': 'Easy',
            'flag': 'flag{gH29XtL8s}',
            'content': 'Here is an image: <img src="/static/rubiks.jpg" alt="hidden" />'
        },
        {
            'id': 3,
            'title': 'Secret Message',
            'description': 'Decrypt this message.',
            'difficulty': 'Easy',
            'flag': 'flag{Xy15Zt9Qw}',
            'content': 'Fdhvdu flskhu phvvdjh: "fdhvdu" (shift 3)\n\nNow use the decoded word as your clue to decode the next message (shift 3):\n\nIodj{Ab15Cz9Tz}'
        },
        {
            'id': 4,
            'title': 'Basic XSS',
            'description': 'Find a way to inject JavaScript code into this web page.',
            'difficulty': 'Easy',
            'flag': 'flag{hQ91RvbJ3}',
            'content': 'Try to inject: <input type="text" />'
        },
        {
            'id': 5,
            'title': 'Inclusion Confusion',
            'description': 'This page includes files dynamically. Can you make it include something it shouldn\'t?',
            'difficulty': 'Easy',
            'flag': 'flag{dT58KyPl0}',
            'content': 'Enter a file path below to include and see its contents.'
        },
        {
            'id': 6,
            'title': 'Cookie Monster',
            'description': 'The admin cookie is stored in the browser. Can you forge it to gain admin access?',
            'difficulty': 'Medium',
            'flag': 'flag{vJ75PaRm9}',
            'content': 'Cookie: user=guest; admin=false'
        },
        {
            'id': 7,
            'title': 'Double Trouble',
            'description': 'This challenge uses double encoding. Decode it twice to find the flag.',
            'difficulty': 'Medium',
            'flag': 'flag{pQ8wXz2RkL}',
            'content': 'Wm14aFozdHdVVGgzV0hveVVtdE1mUT09'
        },
        {
            'id': 8,
            'title': 'Cracking the Code',
            'description': 'This password hash needs to be cracked. Use common wordlists and tools. Put the decrypted value in flag{} format',
            'difficulty': 'Medium',
            'flag': 'flag{password}',
            'content': '5f4dcc3b5aa765d61d8327deb882cf99'
        },
        {
            'id': 9,
            'title': 'Memory Dump',
            'description': 'Download the memory dump and find the flag hidden inside. Use tools like strings or a hex editor.',
            'difficulty': 'Medium',
            'flag': 'flag{T9xQw7Lm2Z}',
            'content': 'Download the file: <a href="http://localhost:5050/static/mem.dmp" download>mem.dmp</a>'
        },
        {
            'id': 10,
            'title': 'Login Bypass',
            'description': 'The login system has a critical flaw. Find a way to bypass authentication entirely.',
            'difficulty': 'Hard',
            'flag': 'flag{mN79JoDv1}',
            'content': 'Login form: <input type="text" name="user" />'
        }
    ]
    
    with app.app_context():
        # Clear existing challenges
        deleted = Challenge.query.delete()
        print(f"[SEED] Deleted {deleted} existing challenges.")
        
        # Add new challenges
        for challenge_data in challenges_data:
            print(f"[SEED] Adding Challenge ID {challenge_data['id']}: {challenge_data['title']}")
            print(f"[SEED] Content: {challenge_data.get('content', None)}")
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