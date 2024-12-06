import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "https://flightsight-538c5.web.app/"] }));

const SERPAPI_KEY = "d4d758e84f346df0a8c55dba108d1f6297fc7c7c61b9910cd763369b2fd46651"; // Use environment variables in production

// Endpoint to fetch flight data
app.post("/api/flights", async (req, res) => {
  const { origin, destination, outboundDate, returnDate } = req.body;

  if (!origin || !destination || !outboundDate) {
    return res.status(400).json({ error: "Missing required fields in request body" });
  }

  try {
    const fetchFlights = async (departure, arrival, date) => {
      const url = new URL("https://serpapi.com/search.json");
      url.searchParams.append("engine", "google_flights");
      url.searchParams.append("type", 2);
      url.searchParams.append("departure_id", departure);
      url.searchParams.append("arrival_id", arrival);
      url.searchParams.append("outbound_date", date);
      url.searchParams.append("currency", "USD");
      url.searchParams.append("hl", "en");
      url.searchParams.append("api_key", SERPAPI_KEY);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok || data.search_metadata?.status !== "Success") {
        console.error("Error in SerpApi response:", data.error || "Unknown error");
        throw new Error("Failed to fetch flight data");
      }

      return {
        best_flights: data.best_flights || [],
        other_flights: data.other_flights || [],
        price_insights: data.price_insights || {},
        booking_options: data.booking_options || {},
      };
    };

    // Fetch outbound flights (e.g., ORD -> LAX)
    const outboundFlights = await fetchFlights(origin, destination, outboundDate);

    // Fetch return flights (e.g., LAX -> ORD), if applicable
    const returnFlights = returnDate
      ? await fetchFlights(destination, origin, returnDate)
      : null;

    res.status(200).json({
      outbound: outboundFlights,
      return: returnFlights,
    });
  } catch (error) {
    console.error("Error fetching flight data:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Endpoint to fetch booking options for a specific flight
app.post("/api/booking", async (req, res) => {
  const { bookingToken, origin, destination, outboundDate, returnDate } = req.body;

  if (!bookingToken || !origin || !destination || !outboundDate) {
    return res.status(400).json({ error: "Missing required fields in request body" });
  }

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.append("type", 2);
    url.searchParams.append("engine", "google_flights");
    url.searchParams.append("departure_id", origin);
    url.searchParams.append("arrival_id", destination);
    url.searchParams.append("outbound_date", outboundDate);
    url.searchParams.append("currency", "USD");
    url.searchParams.append("hl", "en");
    url.searchParams.append("booking_token", bookingToken);
    url.searchParams.append("api_key", SERPAPI_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (response.ok && data.booking_options) {
      res.status(200).json(data.booking_options[0]?.together || {});
    } else {
      console.error("Error in SerpApi booking response:", data.error || "Unknown error");
      res.status(500).json({ error: "Failed to fetch booking options" });
    }
  } catch (error) {
    console.error("Error fetching booking options:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Start the server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
