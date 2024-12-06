import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PriceCalendar from "../components/PriceCalendar";
import FlightDetailsModal from "../components/FlightDetailsModal";
import MoreFlightsModal from "../components/MoreFlightModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Results.css";

const Results = () => {
  const location = useLocation();
  const { origin, destination, departureDate, returnDate } = location.state || {};

  const [flightData, setFlightData] = useState([]);
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateFlights, setSelectedDateFlights] = useState([]);
  const [priceInsights, setPriceInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null); // For flight details modal
  const [moreFlights, setMoreFlights] = useState([]); // For "+X more" modal

  useEffect(() => {
    const fetchFlightData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:5500/api/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin,
            destination,
            outboundDate: departureDate,
            returnDate: returnDate || null, // Only include returnDate if it exists
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch flight data");
        }

        const data = await response.json();
        console.log("Flight data:", data);

        // Combine outbound and return flights into a single array for processing
        const flights = [
          ...(data.outbound.best_flights || []),
          ...(data.outbound.other_flights || []),
          ...(data.return?.best_flights || []),
          ...(data.return?.other_flights || []),
        ];

        // Process flight data to include booking links
        const enrichedFlights = await Promise.all(
          flights.map(async (flight) => {
            const bookingToken = flight.booking_token;

            if (bookingToken) {
              try {
                const bookingResponse = await fetch("http://localhost:5500/api/booking", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    origin,
                    destination,
                    outboundDate: flight.flights[0]?.departure_airport?.time.split(" ")[0] || departureDate,
                    returnDate: returnDate || null,
                    bookingToken
                  }),
                });

                if (bookingResponse.ok) {
                  const bookingData = await bookingResponse.json();
                  flight.bookingLink = bookingData.booking_request?.url || null;
                } else {
                  flight.bookingLink = null;
                }
              } catch (err) {
                flight.bookingLink = null;
              }
            }

            return {
              date: flight.flights[0]?.departure_airport?.time.split(" ")[0] || departureDate,
              price: flight.price,
              flights: flight.flights,
              bookingLink: flight.bookingLink || null,
            };
          })
        );

        setFlightData(enrichedFlights);
        setPriceInsights(data.outbound.price_insights || {});
      } catch (err) {
        setError("Failed to load flight data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && departureDate) {
      fetchFlightData();
    }
  }, [origin, destination, departureDate, returnDate]);

  const toggleView = () => {
    setViewMode(viewMode === "calendar" ? "graph" : "calendar");
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const flightsForDate = flightData.filter((flight) => flight.date === date);
    const sortedFlights = flightsForDate.sort((a, b) => a.price - b.price);
    setSelectedDateFlights(sortedFlights);
  };

  const handlePriceClick = (flight) => {
    setSelectedFlight(flight);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  const handleMoreClick = (date) => {
    const flightsForDate = flightData.filter((flight) => flight.date === date);
    setMoreFlights(flightsForDate);
  };

  const closeMoreFlightsModal = () => {
    setMoreFlights([]);
  };

  if (loading) return <div>Loading flight data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="results-page">
      <h1>Flight Price Results</h1>
      {priceInsights && (
        <div className="price-insights">
          <h3>Price Insights</h3>
          <p>Lowest Price: ${priceInsights.lowest_price}</p>
          <p>Typical Price Range: {priceInsights.typical_price_range?.join(" - ")}</p>
        </div>
      )}
      <div className="toggle-button-container">
        <button onClick={toggleView}>
          Switch to {viewMode === "calendar" ? "Graph View" : "Calendar View"}
        </button>
      </div>
      {selectedDate && (
        <div className="price-history">
          <h1>Flight Prices for {selectedDate}</h1>
          <ul>
            {selectedDateFlights.map((flight, index) => (
              <li key={index}>
                ${flight.price.toFixed(2)} - {flight.flights[0]?.airline || "Unknown Airline"}
                {flight.bookingLink && (
                  <a
                    href={flight.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "10px", color: "blue" }}
                  >
                    Book Now
                  </a>
                )}
              </li>
            ))}
          </ul>
          {selectedDateFlights.length > 0 && (
            <h3>Lowest Price: ${selectedDateFlights[0].price.toFixed(2)}</h3>
          )}
        </div>
      )}
      <div className="results-container">
        {viewMode === "graph" ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={flightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <PriceCalendar
            priceData={flightData}
            onDateClick={handleDateClick}
            onPriceClick={handlePriceClick}
            onMoreClick={handleMoreClick}
          />
        )}
      </div>
      <MoreFlightsModal
        flights={moreFlights}
        onClose={closeMoreFlightsModal}
        onFlightClick={handlePriceClick}
      />
      <FlightDetailsModal flight={selectedFlight} onClose={closeModal} />
    </div>
  );
};

export default Results;