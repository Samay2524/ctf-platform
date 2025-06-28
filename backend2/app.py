import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Challenge
from flask_migrate import Migrate

app = Flask(__name__)

# Production-ready configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'change-this-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ctf.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', '0') == '1'  # Default to False

# CORS: Allow only a specific origin in production
frontend_origin = os.environ.get('FRONTEND_ORIGIN', None)
if frontend_origin:
    CORS(app, origins=[frontend_origin])
else:
    CORS(app)  # Allow all origins for development

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return {'status': 'Backend running!'}

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """Get all challenges"""
    print(f"[API] GET /api/challenges called")
    try:
        challenges = Challenge.query.all()
        print(f"[API] Found {len(challenges)} challenges")
        
        challenges_data = []
        for challenge in challenges:
            challenge_dict = {
                'id': challenge.id,
                'title': challenge.title,
                'description': challenge.description,
                'difficulty': challenge.difficulty
            }
            challenges_data.append(challenge_dict)
        
        print(f"[API] Returning {len(challenges_data)} challenges")
        return jsonify({
            'success': True,
            'challenges': challenges_data
        })
    except Exception as e:
        print(f"[API] Error in get_challenges: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/challenges/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    """Get a specific challenge by ID"""
    print(f"[API] GET /api/challenges/{challenge_id} called")
    try:
        challenge = Challenge.query.get_or_404(challenge_id)
        print(f"[API] Found challenge: {challenge.title}")
        
        challenge_data = {
            'id': challenge.id,
            'title': challenge.title,
            'description': challenge.description,
            'difficulty': challenge.difficulty,
            'content': challenge.content
        }
        
        print(f"[API] Returning challenge data: {challenge_data}")
        return jsonify({
            'success': True,
            'challenge': challenge_data
        })
    except Exception as e:
        print(f"[API] Error in get_challenge: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/challenges/<int:challenge_id>/submit', methods=['POST'])
def submit_flag(challenge_id):
    """Submit a flag for a challenge"""
    try:
        data = request.get_json()
        submitted_flag = data.get('flag', '').strip()
        
        if not submitted_flag:
            return jsonify({
                'success': False,
                'error': 'Flag is required'
            }), 400
        
        challenge = Challenge.query.get_or_404(challenge_id)
        
        if challenge.check_flag(submitted_flag):
            return jsonify({
                'success': True,
                'message': 'Correct flag! Challenge completed.'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Incorrect flag. Try again.'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get challenge statistics"""
    try:
        total_challenges = Challenge.query.count()
        easy_challenges = Challenge.query.filter_by(difficulty='Easy').count()
        medium_challenges = Challenge.query.filter_by(difficulty='Medium').count()
        hard_challenges = Challenge.query.filter_by(difficulty='Hard').count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total': total_challenges,
                'easy': easy_challenges,
                'medium': medium_challenges,
                'hard': hard_challenges
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/challenges/6/flag', methods=['GET'])
def get_cookie_monster_flag():
    """Reveal the flag for Cookie Monster if the admin cookie is set to true"""
    admin_cookie = request.cookies.get('admin', 'false')
    if admin_cookie == 'true':
        # Return the actual flag for challenge 6
        return jsonify({
            'success': True,
            'flag': 'flag{vJ75PaRm9}'
        })
    else:
        return jsonify({'success': False, 'message': 'You are not admin. Set the admin cookie to true.'}), 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True) 