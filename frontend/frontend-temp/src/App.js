import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import ChallengeList from './components/ChallengeList';
import ChallengeDetail from './components/ChallengeDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenge/:id" element={<ChallengeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
