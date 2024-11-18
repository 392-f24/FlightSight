import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const airportOriginOptions = [
  { code: 'ORD', name: "Chicago O'Hare International Airport" },
  { code: 'MDW', name: 'Chicago Midway International Airport' },
];

const airportDestinationOptions = [
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport' },
  { code: 'PEK', name: 'Beijing Capital International Airport' },
  { code: 'LAX', name: 'Los Angeles International Airport' },
  { code: 'DXB', name: 'Dubai International Airport' },
  { code: 'HND', name: 'Tokyo Haneda Airport' },
  { code: 'LHR', name: 'London Heathrow Airport' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport' },
  { code: 'CDG', name: 'Paris Charles de Gaulle Airport' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport' },
];

const Home = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results');
  };

  return (
    <div className="home-page">
      <h1 className='title'>FlightSight</h1>
      <h3 className='subtitle'>The Northwestern student one-stop-shop for finding afford flights!</h3>
      <form onSubmit={handleSubmit} className="flight-form">
        <Stack spacing={3}>
          <Autocomplete
            options={airportOriginOptions}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            value={origin}
            onChange={(event, newValue) => setOrigin(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Origin Airport" required />
            )}
          />
          <Autocomplete
            options={airportDestinationOptions}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            value={destination}
            onChange={(event, newValue) => setDestination(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Destination Airport" required />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Departure Date"
              value={departureDate}
              onChange={(newValue) => setDepartureDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} required />
              )}
            />
            <DatePicker
              label="Return Date (Optional)"
              value={returnDate}
              onChange={(newValue) => setReturnDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button variant="contained" color="primary" type="submit">
            Get Flight Price History
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default Home;
