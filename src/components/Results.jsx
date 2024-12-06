import React, { useState, useEffect } from "react";
import OpenAI from "openai";
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

  const [flightData, setFlightData] = useState([]); // Combined data
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [outboundInsights, setOutboundInsights] = useState(null);
  const [returnInsights, setReturnInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(""); // OpenAI recommendations
  const [viewMode, setViewMode] = useState("calendar");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null); // For flight details modal
  const [moreFlights, setMoreFlights] = useState([]); // For "+X more" modal

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    const fetchFlightData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://us-central1-flightsight-538c5.cloudfunctions.net/fetchFlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin,
            destination,
            outboundDate: departureDate,
            returnDate: returnDate || null,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch flight data");
        }

        const data = await response.json();

        // Combine outbound and return flights into a single array for processing
        const allFlights = [
          ...(data.outbound.best_flights || []),
          ...(data.outbound.other_flights || []),
          ...(data.return?.best_flights || []),
          ...(data.return?.other_flights || []),
        ];

        // Process flight data to include booking links
        const enrichedFlights = await Promise.all(
          allFlights.map(async (flight) => {
            const bookingToken = flight.booking_token;

            if (bookingToken) {
              try {
                const bookingResponse = await fetch("https://us-central1-flightsight-538c5.cloudfunctions.net/fetchFlights", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingToken,
                    origin,
                    destination,
                    outboundDate: flight.flights[0]?.departure_airport?.time.split(" ")[0] || departureDate,
                    returnDate: returnDate || null,
                  }),
                });

                if (bookingResponse.ok) {
                  const bookingData = await bookingResponse.json();
                  flight.bookingLink = bookingData.booking_request 
                  ? `${bookingData.booking_request.url}?${bookingData.booking_request.post_data}` 
                  : null;
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
        setOutboundFlights([
          ...(data.outbound.best_flights || []),
          ...(data.outbound.other_flights || []),
        ]);
        setOutboundInsights(data.outbound.price_insights || {});

        if (data.return) {
          setReturnFlights([
            ...(data.return.best_flights || []),
            ...(data.return.other_flights || []),
          ]);
          setReturnInsights(data.return.price_insights || {});
        }
      } catch (err) {
        setError("Failed to load flight data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && departureDate) {
      fetchFlightData();
      fetchRecommendations(departureDate, destination); // Fetch recommendations
    }
  }, [origin, destination, departureDate, returnDate]);

  const fetchRecommendations = async (date, destinationLocation) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful travel assistant." },
          {
            role: "user",
            content: `Suggest travel recommendations for a trip to ${destinationLocation} starting on ${date}. Include activities, events, or places to visit.`,
          },
        ],
        max_tokens: 150,
      });
      const recommendationText = response.choices[0].message.content.trim();
      setRecommendations(recommendationText);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations("Unable to fetch recommendations. Please try again later.");
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === "calendar" ? "graph" : "calendar");
  };

  const handleDateClick = (date) => {
    const flightsForDate = flightData.filter((flight) => flight.date === date);
    const sortedFlights = flightsForDate.sort((a, b) => a.price - b.price);
    setMoreFlights(sortedFlights);
  };

  const handlePriceClick = (flight) => {
    setSelectedFlight(flight);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  const closeMoreFlightsModal = () => {
    setMoreFlights([]);
  };

  if (loading) return <div>Loading flight data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="results-page">
      <h1>Flight Price Results</h1>
      {recommendations && (
        <div className="recommendations">
          <h3>Travel Recommendations for {destination.name}</h3>
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="price-insights-container">
        {outboundInsights && (
          <div className="price-insights">
            <h3>Outbound Price Insights</h3>
            <p>Lowest Price: ${outboundInsights.lowest_price}</p>
            <p>
              Typical Price Range:{" "}
              {outboundInsights.typical_price_range?.join(" - ")}
            </p>
          </div>
        )}
        {returnInsights && (
          <div className="price-insights">
            <h3>Return Price Insights</h3>
            <p>Lowest Price: ${returnInsights.lowest_price}</p>
            <p>
              Typical Price Range:{" "}
              {returnInsights.typical_price_range?.join(" - ")}
            </p>
          </div>
        )}
      </div>
      <div className="toggle-button-container">
        <button onClick={toggleView}>
          Switch to {viewMode === "calendar" ? "Graph View" : "Calendar View"}
        </button>
      </div>
      {viewMode === "graph" ? (
        <div className="graphs-container">
          <div className="chart">
            <h3>Outbound Flight Prices</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={outboundFlights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {returnFlights.length > 0 && (
            <div className="chart">
              <h3>Return Flight Prices</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={returnFlights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ) : (
        <div className="calendar-container">
          <PriceCalendar
            priceData={flightData}
            onDateClick={handleDateClick}
            onPriceClick={handlePriceClick}
            onMoreClick={handleDateClick}
          />
        </div>
      )}
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
