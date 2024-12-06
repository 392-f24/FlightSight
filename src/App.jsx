import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Results from './components/Results';
import Suggestions from './components/Suggestions';
import Flights from './components/Flights';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/flights" element={<Flights />} />
      </Routes>
    </Router>
  );
}

export default App;
