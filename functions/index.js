const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors");

const corsMiddleware = cors({ origin: "https://flightsight-538c5.web.app" }); // Specify allowed origin
const SERPAPI_KEY = functions.config().serpapi.key;

// Firebase HTTPS function to fetch flight data
exports.fetchFlights = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { origin, destination, outboundDate, returnDate } = req.body;

    if (!origin || !destination || !outboundDate) {
      return res.status(400).json({ error: "Missing required fields in request body" });
    }

    try {
      const fetchFlights = async (departure, arrival, date) => {
        const url = new URL("https://serpapi.com/search.json");
        url.searchParams.append("engine", "google_flights");
        url.searchParams.append("type", 2); // One-way flight
        url.searchParams.append("departure_id", departure);
        url.searchParams.append("arrival_id", arrival);
        url.searchParams.append("outbound_date", date);
        url.searchParams.append("currency", "USD");
        url.searchParams.append("hl", "en");
        url.searchParams.append("api_key", SERPAPI_KEY);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok || data.search_metadata?.status !== "Success") {
          throw new Error("Failed to fetch flight data");
        }

        return {
          best_flights: data.best_flights || [],
          other_flights: data.other_flights || [],
          price_insights: data.price_insights || {},
          booking_options: data.booking_options || {},
        };
      };

      // Fetch outbound flights
      const outboundFlights = await fetchFlights(origin, destination, outboundDate);

      // Fetch return flights if applicable
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
});

// Firebase HTTPS function to fetch booking options
exports.fetchBooking = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { bookingToken, origin, destination, outboundDate, returnDate } = req.body;

    if (!bookingToken || !origin || !destination || !outboundDate) {
      return res.status(400).json({ error: "Missing required fields in request body" });
    }

    try {
      const url = new URL("https://serpapi.com/search.json");
      url.searchParams.append("type", 2); // One-way flight
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
        throw new Error("Failed to fetch booking options");
      }
    } catch (error) {
      console.error("Error fetching booking options:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
});
