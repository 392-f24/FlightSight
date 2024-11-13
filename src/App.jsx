// App.jsx

import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>FlightSight</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>Search Flights</li>
            <li>Price Trends</li>
            <li>My Bookings</li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <div className="calendar-container">
          <header className="calendar-header">
            <button className="nav-button">{"<"}</button>
            <h2>September 2021</h2>
            <button className="nav-button">{">"}</button>
          </header>
          <div className="calendar">
            <div className="day-names">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="day-name">{day}</div>
              ))}
            </div>
            <div className="days">
              {[...Array(30).keys()].map((day) => (
                <div
                  key={day + 1}
                  className={`day ${selectedDate === day + 1 ? 'selected' : ''}`}
                  onClick={() => handleDateClick(day + 1)}
                >
                  {day + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Price history for this search</h3>
          <div className="chart">
            <svg width="100%" height="100">
              <polyline
                fill="none"
                stroke="#ff6347"
                strokeWidth="3"
                points="0,60 20,50 40,60 60,45 80,55 100,40 120,50 140,65 160,55 180,70 200,65 220,80 240,60"
              />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;