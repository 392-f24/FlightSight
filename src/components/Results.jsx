import React, { useState, useEffect } from 'react';
import PriceCalendar from '../components/PriceCalendar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './Results.css';

const priceData = [
  { date: '2024-11-19', price: 199.99 },
  { date: '2024-11-20', price: 249.99 },
  { date: '2024-11-21', price: 179.99 },
  { date: '2024-11-22', price: 209.99 },
  { date: '2024-11-23', price: 159.99 },
  { date: '2024-11-24', price: 299.99 },
  { date: '2024-11-25', price: 189.99 },
  { date: '2024-11-26', price: 239.99 },
  { date: '2024-11-27', price: 229.99 },
];

const Results = () => {
  const [flightData, setFlightData] = useState([]);
  const [viewMode, setViewMode] = useState('calendar');

  useEffect(() => {
    // Simulate fetching flight data or reuse hardcoded values
    const simulatedData = [
      { date: '2024-11-19', price: 199.99 },
      { date: '2024-11-20', price: 249.99 },
      { date: '2024-11-21', price: 179.99 },
      { date: '2024-11-22', price: 209.99 },
      { date: '2024-11-23', price: 159.99 },
      { date: '2024-11-24', price: 299.99 },
      { date: '2024-11-25', price: 189.99 },
      { date: '2024-11-26', price: 239.99 },
      { date: '2024-11-27', price: 229.99 },
    ];
    setFlightData(simulatedData);
  }, []);

  const toggleView = () => {
    setViewMode(viewMode === 'calendar' ? 'graph' : 'calendar');
  };

  return (
    <div className="results-page">
      <h1>Flight Price Results</h1>
      <div className="toggle-button-container">
        <button onClick={toggleView}>
          Switch to {viewMode === 'calendar' ? 'Graph View' : 'Calendar View'}
        </button>
      </div>
      <div className="results-container">
        {viewMode === 'graph' ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={flightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <PriceCalendar priceData={priceData} />
        )}
      </div>
    </div>
  );
};

export default Results;
