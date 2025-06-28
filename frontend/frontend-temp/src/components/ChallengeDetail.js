import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginResult, setLoginResult] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinResult, setPinResult] = useState('');
  const [cookieFlag, setCookieFlag] = useState('');
  const [cookieFlagError, setCookieFlagError] = useState('');
  const [xssTempInput, setXssTempInput] = useState('');
  const [xssInput, setXssInput] = useState('');
  const [lfiTempPath, setLfiTempPath] = useState('');
  const [lfiPath, setLfiPath] = useState('');

  useEffect(() => {
    fetchChallenge();
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    setCompletedChallenges(completed);
  }, [id]);

  useEffect(() => {
    if (challenge && challenge.id === 6) {
      document.cookie = 'admin=false; path=/';
    }
  }, [challenge]);

  useEffect(() => {
    setXssTempInput('');
    setXssInput('');
  }, [id]);

  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`);
      const data = await response.json();
      if (data.success) {
        setChallenge(data.challenge);
      } else {
        setMessage('Challenge not found');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setMessage('Error loading challenge');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/challenges/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag: flag.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('🎉 Correct flag! Challenge completed!');
        setMessageType('success');
        setFlag('');
        
        // Add to completed challenges
        const updatedCompleted = [...completedChallenges, parseInt(id)];
        localStorage.setItem('completedChallenges', JSON.stringify(updatedCompleted));
        setCompletedChallenges(updatedCompleted);
        
        // Auto-advance to next challenge after 2 seconds
        setTimeout(() => {
          const nextChallenge = parseInt(id) + 1;
          if (nextChallenge <= 15) {
            navigate(`/challenge/${nextChallenge}`);
          } else {
            navigate('/challenges');
          }
        }, 2000);
      } else {
        setMessage('❌ Incorrect flag. Try again!');
        setMessageType('error');
        setFlag('');
      }
    } catch (error) {
      console.error('Error submitting flag:', error);
      setMessage('Error submitting flag');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFakeLogin = (e) => {
    e.preventDefault();
    if (loginUser.trim() === "' OR 1=1--" || loginPass.trim() === "' OR 1=1--") {
      setIsLoggedIn(true);
      setLoginResult('🎉 Login bypassed! Welcome, admin. Please enter the admin PIN to continue.');
    } else {
      setLoginResult('<span class="text-red-400">❌ Login failed. Try again.</span>');
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (adminPin.trim() === '1234') {
      setPinResult('🎉 Correct PIN! The flag is: <span class="text-green-400 font-mono">flag{mN79JoDv1}</span>');
    } else {
      setPinResult('<span class="text-red-400">❌ Incorrect PIN. Try again.</span>');
    }
  };

  const handleRevealCookieFlag = async () => {
    setCookieFlag('');
    setCookieFlagError('');
    try {
      const response = await fetch('/api/challenges/6/flag', { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setCookieFlag(data.flag);
      } else {
        setCookieFlagError(data.message);
      }
    } catch (err) {
      setCookieFlagError('Error contacting backend.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Challenge not found</div>
          <Link to="/challenges" className="text-green-400 hover:text-green-300">
            ← Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = completedChallenges.includes(parseInt(id));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-400">
              🏴‍☠️ CTF Challenge
            </h1>
            <Link to="/challenges" className="bg-gray-800 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg border border-gray-700 hover:border-green-400 transition-colors ml-4">
              ← Back to Challenges
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Challenge Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{challenge.title}</h2>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)} bg-gray-700`}>
                {challenge.difficulty}
              </span>
              <span className="text-gray-400 text-sm">Level {challenge.id}</span>
            </div>
          </div>
          
          {isCompleted && (
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4">
              ✅ Challenge Completed!
            </div>
          )}
        </div>

        {/* Challenge Description */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
        </div>

        {/* Challenge Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Challenge</h3>
          <div className="bg-black rounded-lg p-4 border border-gray-700">
            {parseInt(challenge.id) === 10 ? (
              <div>
                {!isLoggedIn ? (
                  <form onSubmit={handleFakeLogin} className="space-y-4 mb-4">
                    <div>
                      <label className="block text-gray-300 mb-1">Username</label>
                      <input
                        type="text"
                        value={loginUser}
                        onChange={e => setLoginUser(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">Password</label>
                      <input
                        type="password"
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        placeholder="Enter password"
                      />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Login</button>
                  </form>
                ) : (
                  <form onSubmit={handlePinSubmit} className="space-y-4 mb-4">
                    <div className="text-green-400 text-center mb-2">🎉 Login bypassed! Welcome, admin. Please enter the admin PIN to continue.</div>
                    <div>
                      <label className="block text-gray-300 mb-1">Admin PIN</label>
                      <input
                        type="text"
                        value={adminPin}
                        onChange={e => setAdminPin(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                        placeholder="Enter admin PIN"
                      />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Submit PIN</button>
                  </form>
                )}
                <div className="text-center text-sm mt-2" dangerouslySetInnerHTML={{ __html: isLoggedIn ? pinResult : loginResult }} />
                <div className="mt-4 text-gray-400 text-xs text-center">Hint: Try a classic SQL injection payload!</div>
              </div>
            ) : challenge.id === 6 ? (
              <div>
                <div className="mb-4 text-gray-300">Cookie: user=guest; admin=false</div>
                <button
                  onClick={handleRevealCookieFlag}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mb-3"
                >
                  Reveal Flag
                </button>
                {cookieFlag && (
                  <div className="mt-3 text-green-400 font-mono">Flag: {cookieFlag}</div>
                )}
                {cookieFlagError && (
                  <div className="mt-3 text-red-400">{cookieFlagError}</div>
                )}
              </div>
            ) : parseInt(challenge.id) === 3 ? (
              <div>
                <form onSubmit={e => { e.preventDefault(); setXssInput(xssTempInput); }} className="mb-4">
                  <label className="block text-gray-300 mb-1">Try to inject:</label>
                  <input
                    type="text"
                    value={xssTempInput || ''}
                    onChange={e => setXssTempInput(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 mb-2"
                    placeholder="Enter your input here..."
                  />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Submit</button>
                </form>
                <div className="mt-4 p-3 bg-black rounded-lg border border-gray-700">
                  <iframe
                    title="xss-demo"
                    style={{ width: '100%', height: 100, background: 'white', border: '1px solid #444' }}
                    srcDoc={(xssInput || '').replace(/alert/gi, 'void')}
                  />
                  {xssInput && /<script/i.test(xssInput) && (
                    <div className="mt-4 p-2 bg-green-900 text-green-300 rounded-lg text-center">
                      🎉 XSS detected! Here is your flag: <span className="font-mono text-green-400">flag&#123;hQ91RvbJ3&#125;</span>
                    </div>
                  )}
                </div>
              </div>
            ) : parseInt(challenge.id) === 5 ? (
              <div>
                <form onSubmit={e => { e.preventDefault(); setLfiPath(lfiTempPath); }} className="mb-4">
                  <label className="block text-gray-300 mb-1">File to include:</label>
                  <input
                    type="text"
                    value={lfiTempPath || ''}
                    onChange={e => setLfiTempPath(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 mb-2"
                    placeholder="e.g. secret/flag.txt"
                  />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Include File</button>
                </form>
                <div className="mt-4 p-3 bg-black rounded-lg border border-gray-700 min-h-[60px]">
                  {lfiPath ? (
                    lfiPath === '../' || lfiPath === './' || lfiPath === '/' ? (
                      <pre className="text-xs text-gray-200">about.html\ncontact.html\nsecret/</pre>
                    ) : lfiPath === 'secret/' ? (
                      <pre className="text-xs text-gray-200">flag.txt</pre>
                    ) : lfiPath === 'secret/flag.txt' ? (
                      <div className="text-green-400 font-mono">flag&#123;dT58KyPl0&#125;</div>
                    ) : lfiPath.includes('passwd') ? (
                      <pre className="text-xs text-gray-200">root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nuser:x:1000:1000:user:/home/user:/bin/bash\n...</pre>
                    ) : (
                      <span className="text-gray-400">File not found or not readable.</span>
                    )
                  ) : (
                    <span className="text-gray-400">Output will appear here...</span>
                  )}
                </div>
              </div>
            ) : (
              challenge.content && (
                <div
                  className="text-green-400 text-sm whitespace-pre-wrap font-mono"
                  dangerouslySetInnerHTML={{ __html: challenge.content }}
                />
              )
            )}
            {console.log('Challenge content:', challenge.content)}
          </div>
        </div>

        {/* Flag Submission */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Submit Flag</h3>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="flag" className="block text-sm font-medium text-gray-300 mb-2">
                Flag Format: flag{'{'}[your_answer]{'}'}
              </label>
              <input
                type="text"
                id="flag"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="flag{your_answer_here}"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                disabled={submitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting || !flag.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Flag'}
            </button>
          </form>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {parseInt(id) > 1 && (
            <Link
              to={`/challenge/${parseInt(id) - 1}`}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Previous Challenge
            </Link>
          )}
          
          {parseInt(id) < 15 && (
            <Link
              to={`/challenge/${parseInt(id) + 1}`}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
            >
              Next Challenge →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

export default ChallengeDetail; 