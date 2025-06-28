from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Challenge
import os
from flask_migrate import Migrate

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ctf.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def index():
    return {'status': 'Backend running!'}

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """Get all challenges"""
    try:
        challenges = Challenge.query.order_by(Challenge.id).all()
        challenges_data = []
        for challenge in challenges:
            challenges_data.append({
                'id': challenge.id,
                'title': challenge.title,
                'description': challenge.description,
                'difficulty': challenge.difficulty
            })
        return jsonify({
            'success': True,
            'challenges': challenges_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/challenges/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    """Get a specific challenge by ID"""
    try:
        challenge = Challenge.query.get_or_404(challenge_id)
        return jsonify({
            'success': True,
            'challenge': {
                'id': challenge.id,
                'title': challenge.title,
                'description': challenge.description,
                'difficulty': challenge.difficulty,
                'content': challenge.content
            }
        })
    except Exception as e:
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 