import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { useLocation } from 'react-router-dom';
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
import { Navigate, useNavigate } from 'react-router-dom';

const priceData = [
  { date: '2024-11-19', price: 199.99, flights: [{ price: 199.99 }, { price: 229.99 }, { price: 249.99 }] },
  { date: '2024-11-20', price: 249.99, flights: [{ price: 249.99 }, { price: 269.99 }, { price: 259.99 }] },
  { date: '2024-11-21', price: 179.99, flights: [{ price: 179.99 }, { price: 189.99 }, { price: 209.99 }] },
  { date: '2024-11-22', price: 209.99, flights: [{ price: 209.99 }, { price: 219.99 }, { price: 239.99 }] },
  { date: '2024-11-23', price: 159.99, flights: [{ price: 159.99 }, { price: 169.99 }, { price: 189.99 }] },
  { date: '2024-11-24', price: 299.99, flights: [{ price: 299.99 }, { price: 319.99 }, { price: 309.99 }] },
  { date: '2024-11-25', price: 189.99, flights: [{ price: 189.99 }, { price: 199.99 }, { price: 179.99 }] },
  { date: '2024-11-26', price: 239.99, flights: [{ price: 239.99 }, { price: 249.99 }, { price: 259.99 }] },
  { date: '2024-11-27', price: 229.99, flights: [{ price: 229.99 }, { price: 249.99 }, { price: 239.99 }] },
  { date: '2024-11-28', price: 201.41, flights: [{ price: 195.72 }, { price: 216.99 }, { price: 227.21 }] },
  { date: '2024-11-29', price: 116.57, flights: [{ price: 125.99 }, { price: 135.20 }, { price: 118.97 }] },
  { date: '2024-11-30', price: 126.38, flights: [{ price: 136.45 }, { price: 142.50 }, { price: 132.90 }] },
  { date: '2024-12-01', price: 102.71, flights: [{ price: 118.35 }, { price: 110.72 }, { price: 103.80 }] },
  { date: '2024-12-02', price: 118.87, flights: [{ price: 125.88 }, { price: 122.45 }, { price: 119.29 }] },
  { date: '2024-12-03', price: 329.48, flights: [{ price: 315.78 }, { price: 334.99 }, { price: 325.16 }] },
  { date: '2024-12-04', price: 236.97, flights: [{ price: 230.91 }, { price: 242.15 }, { price: 225.61 }] },
  { date: '2024-12-05', price: 311.35, flights: [{ price: 303.65 }, { price: 311.74 }, { price: 309.99 }] },
  { date: '2024-12-06', price: 287.25, flights: [{ price: 280.50 }, { price: 290.16 }, { price: 276.32 }] }
];


const Results = () => {
  const [flightData, setFlightData] = useState([]);
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateFlights, setSelectedDateFlights] = useState([]);
  const [recommendations, setRecommendations] = useState('');
  const location = useLocation();
  const { origin, destination, departureDate, returnDate } = location.state || {}; // Default to empty object if no state

  const navigate = useNavigate();

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    setFlightData(priceData); // Set flight data initially
    console.log(departureDate)

    if (departureDate && destination) {
      // Fetch recommendations once we have the departure date and destination
      fetchRecommendations(departureDate, destination);
    }
  }, [departureDate, destination]); // Only trigger when departureDate or destination changes

  const toggleView = () => {
    setViewMode(viewMode === 'calendar' ? 'graph' : 'calendar');
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const flightsForDate = flightData.find(flight => flight.date === date)?.flights || [];
    const sortedFlights = flightsForDate.sort((a, b) => a.price - b.price);
    setSelectedDateFlights(sortedFlights);
  };

  const fetchRecommendations = async (date, destinationLocation) => {
    console.log("fetchRecommendations called")
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful travel assistant.' },
          {
            role: 'user',
            content: `Suggest travel recommendations for a trip to ${destinationLocation} starting on ${date}. Include activities, events, or places to visit.`,
          },
        ],
        max_tokens: 150,
      });
      const recommendationText = response.choices[0].message.content.trim();
      setRecommendations(recommendationText); // Update recommendations state
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations('Unable to fetch recommendations. Please try again later.');
    }
  };

  return (
    <div className="results-page">
      <h1>Flight Price Results</h1>
      <button onClick={() => {navigate('/flights', { state: { origin, destination, departureDate, returnDate } })}}>
          Show Flights
        </button>
      <div className="toggle-button-container">
        <button onClick={toggleView}>
          Switch to {viewMode === 'calendar' ? 'Graph View' : 'Calendar View'}
        </button>
      </div>
      {selectedDate && (
        <div className="price-history">
          <h1>Flight Prices for {selectedDate}</h1>
          <ul>
            {selectedDateFlights.map((flight, index) => (
              <li key={index}>${flight.price.toFixed(2)}</li>
            ))}
          </ul>
          {selectedDateFlights.length > 0 && (
            <h3>Lowest Price: ${selectedDateFlights[0].price.toFixed(2)}</h3>
          )}
        </div>
      )}
      {recommendations && (
        <div className="recommendations">
          <h3>Travel Recommendations</h3>
          <p>{recommendations}</p>
        </div>
      )}
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
          <PriceCalendar priceData={priceData} onDateClick={handleDateClick} />
        )}
      </div>
    </div>
  );
};

export default Results;
