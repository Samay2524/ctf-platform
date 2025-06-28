import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-400">
              🏴‍☠️ CTF Challenge
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-5">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">
            Welcome to the CTF Challenge
          </h2>
          <p className="text-lg text-gray-400 mb-4">
            Complete challenges in sequential order to unlock the next level
          </p>
          
          {/* What is CTF Section */}
          <div className="max-w-xl mx-auto mb-5">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-2 text-center">
                🎯 What is CTF?
              </h3>
              <p className="text-sm text-gray-300 text-center leading-relaxed">
                <strong className="text-blue-400">Capture The Flag (CTF)</strong> is a cybersecurity competition where participants solve challenges to find hidden "flags". 
                It's like a digital treasure hunt testing your skills in cryptography, web security, and forensics!
              </p>
            </div>
          </div>
          
          {/* How It Works Section (improved) */}
          <div className="max-w-xl mx-auto mb-5">
            <div className="bg-gray-800 rounded-lg p-4 border border-green-400 shadow-lg">
              <h3 className="text-lg font-bold text-green-400 mb-3 text-center">
                🎯 How It Works
              </h3>
              <div className="text-gray-200 text-base space-y-2 mb-3">
                <div>Solve each challenge to find a hidden flag.</div>
                <div>Flags are in the format <span className="text-green-400 font-mono">flag&#123;...&#125;</span>.</div>
                <div>Submit the flag to complete the challenge and unlock the next one.</div>
                <div>Progress through all challenges to finish the CTF!</div>
              </div>
              <div className="mt-4 p-3 bg-gray-900 rounded-lg border-l-4 border-green-400 text-sm text-gray-300">
                <strong className="text-green-400">Note:</strong> Challenges are a mix of <span className="text-green-400">Easy</span>, <span className="text-yellow-400">Medium</span>, and <span className="text-red-400">Hard</span> levels. None require downloading special tools—everything can be solved with your browser and local terminal.
              </div>
            </div>
          </div>
          
          <div className="mt-5">
            <Link 
              to="/challenges"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg inline-block"
            >
              Start Challenge
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home; 