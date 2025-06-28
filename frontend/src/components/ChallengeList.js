import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        console.log('Fetching challenges from /api/challenges...');
        const response = await fetch('/api/challenges');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success && data.challenges) {
          console.log('Setting challenges:', data.challenges);
          setChallenges(data.challenges);
        } else {
          console.error('Invalid data format:', data);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
    // Load completed challenges from localStorage
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    setCompletedChallenges(completed);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">Loading challenges...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl text-red-400">Error: {error}</div>;
  }

  console.log('Rendering challenges:', challenges);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-400">
              🏴‍☠️ CTF Challenge
            </h1>
            <Link to="/" className="bg-gray-800 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg border border-gray-700 hover:border-green-400 transition-colors ml-4">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Challenge List
        </h1>
        <p className="text-center mb-8 text-gray-400">
          Complete challenges in order to unlock the next level
        </p>
        {challenges.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No challenges available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {challenges.map((challenge) => {
              const isCompleted = completedChallenges.includes(challenge.id);
              return (
                <Link
                  key={challenge.id}
                  to={`/challenge/${challenge.id}`}
                  className={`relative group rounded-2xl p-6 bg-gray-800 border-2 border-gray-700 hover:border-green-400 shadow-lg transition-all flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-green-400`}
                >
                  {/* Checkmark badge for completed */}
                  {isCompleted && (
                    <span className="absolute top-3 right-3 bg-green-600 text-white rounded-full p-1 shadow-lg z-10" title="Solved">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        {challenge.title}
                      </h2>
                      <p className="text-gray-300 mb-4 text-sm min-h-[40px]">{challenge.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        challenge.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-gray-500 text-xs">Level {challenge.id}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChallengeList; 