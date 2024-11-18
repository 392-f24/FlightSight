import React, { useState } from 'react';
import './App.css';
import PriceCalendar from './components/PriceCalendar';
// Import Recharts components for the chart
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

// Import Material-UI components
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Import DatePicker components
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Airport options
const airportOptions = [
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport' },
  { code: 'PEK', name: 'Beijing Capital International Airport' },
  { code: 'LAX', name: 'Los Angeles International Airport' },
  { code: 'DXB', name: 'Dubai International Airport' },
  { code: 'HND', name: 'Tokyo Haneda Airport' },
  { code: 'ORD', name: "Chicago O'Hare International Airport" },
  { code: 'LHR', name: 'London Heathrow Airport' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport' },
  { code: 'CDG', name: 'Paris Charles de Gaulle Airport' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport' },
  // Add more airports as needed
];

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

function App() {
  // State variables
  const [selectedDate, setSelectedDate] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureStartDate, setDepartureStartDate] = useState(null);
  const [departureEndDate, setDepartureEndDate] = useState(null);
  const [flightData, setFlightData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredData = priceData.filter((data) => {
      const dataDate = new Date(data.date);
      const startDate = departureStartDate ? new Date(departureStartDate) : null;
      const endDate = departureEndDate ? new Date(departureEndDate) : null;

      return (
        (!startDate || dataDate >= startDate) && (!endDate || dataDate <= endDate)
      );
    });

    setFlightData(filteredData);
    setSubmitted(true);
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
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Autocomplete
                options={airportOptions}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={origin}
                onChange={(event, newValue) => setOrigin(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Origin Airport" required />
                )}
              />
              <Autocomplete
                options={airportOptions}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={destination}
                onChange={(event, newValue) => setDestination(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Destination Airport" required />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Departure Start Date"
                  value={departureStartDate}
                  onChange={(newValue) => setDepartureStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} required />
                  )}
                />
                <DatePicker
                  label="Departure End Date"
                  value={departureEndDate}
                  onChange={(newValue) => setDepartureEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} required />
                  )}
                />
              </LocalizationProvider>
              <Button variant="contained" color="primary" type="submit">
                Get Flight Price History
              </Button>
            </Stack>
          </form>
        </div>

        {/* Adjusted layout to display both calendar and graph side by side */}
        <div className="data-container">
          <div className="chart-container" style={{ flex: 1 }}>
            {flightData && (
              <div>
                <h2>Flight Price History</h2>
                <ResponsiveContainer width="100%" height={300}>
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
            )}
          </div>
          {submitted && (
            <PriceCalendar priceData={flightData || priceData} />
          )}
        </div>
      </main> 
    </div>
  );
}

export default App;
         