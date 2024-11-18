import React from 'react';
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
  { date: '2024-11-01', price: 199.99 },
  { date: '2024-11-02', price: 249.99 },
  { date: '2024-11-03', price: 179.99 },
  { date: '2024-11-04', price: 209.99 },
  { date: '2024-11-05', price: 159.99 },
  { date: '2024-11-06', price: 299.99 },
  { date: '2024-11-07', price: 189.99 },
  { date: '2024-11-08', price: 239.99 },
  { date: '2024-11-09', price: 229.99 },
];

const Results = () => {
  return (
    <div className="results-page">
      <h1>Flight Price History</h1>
      <div className="results-container">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <PriceCalendar priceData={priceData} />
      </div>
    </div>
  );
};

export default Results;
