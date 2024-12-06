import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const SERPAPI_KEY = "e6cb6b133eb0c2164d92c95280174ffd0995cf89a365a7f8fce68b6bdc45d4f8"; // Use environment variables in production

// Endpoint to fetch flight data
app.post("/api/flights", async (req, res) => {
  const { origin, destination, outboundDate, returnDate } = req.body;

  if (!origin || !destination || !outboundDate) {
    return res.status(400).json({ error: "Missing required fields in request body" });
  }

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.append("engine", "google_flights");
    url.searchParams.append("departure_id", origin);
    url.searchParams.append("arrival_id", destination);
    url.searchParams.append("outbound_date", outboundDate);
    if (returnDate) url.searchParams.append("return_date", returnDate);
    url.searchParams.append("currency", "USD");
    url.searchParams.append("hl", "en");
    url.searchParams.append("api_key", SERPAPI_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (response.ok && data.search_metadata?.status === "Success") {
      res.status(200).json({
        best_flights: data.best_flights || [],
        other_flights: data.other_flights || [],
        price_insights: data.price_insights || {},
      });
    } else {
      console.error("Error in SerpApi response:", data.error || "Unknown error");
      res.status(500).json({ error: "Failed to fetch flight data" });
    }
  } catch (error) {
    console.error("Error fetching flight data:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Endpoint to fetch booking options for a specific flight
app.post("/api/booking", async (req, res) => {
  const { bookingToken } = req.body;

  if (!bookingToken) {
    return res.status(400).json({ error: "Missing bookingToken in request body" });
  }

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.append("engine", "google_flights");
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
