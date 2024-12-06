import { useLocation } from "react-router-dom";

const findFlights = async () => {
    const location = useLocation();
    const { origin, destination, departureDate, returnDate } = location.state || {}; // Default to empty object if no state

    const departureDateObject = new Date(departureDate.$d);
    const departureYear = departureDateObject.getFullYear();
    const departureMonth = String(departureDateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const departureDay = String(departureDateObject.getDate()).padStart(2, '0');
    const formattedDepartureDate = `${departureYear}-${departureMonth}-${departureDay}`;

    const returnDateObject = new Date(returnDate.$d);
    const returnYear = returnDateObject.getFullYear();
    const returnMonth = String(returnDateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const returnDay = String(returnDateObject.getDate()).padStart(2, '0');
    const formattedReturnDate = `${returnYear}-${returnMonth}-${returnDay}`;

    const tripType = 'onewaytrip';
    const adults = 1;
    const children = 0;
    const infants = 0;
    const currency = 'USD';
    const cabinClass = 'Economy';
    const apiKey = "6750b7aaac6016bffe22ba5a"; 
    const apiUrl = `https://api.flightapi.io/${tripType}/${apiKey}/${origin.code}/${destination.code}/${formattedDepartureDate}/${adults}/${children}/${infants}/${cabinClass}/${currency}`;
    // const apiUrl = `http://localhost:3001/${tripType}/${apiKey}/${origin.code}/${destination.code}/${formattedDepartureDate}/${adults}/${children}/${infants}/${cabinClass}/${currency}`;
    fetch(apiUrl, {
        method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
        console.log("response is: \n", response);
        if (!response.ok) {
            throw new Error('Failed to fetch flight data');
        }
        return response.body; // Parse the response JSON
        })
        .catch((err) => {
        console.error("Error fetching response from API: \n", err); // Log the error for debugging
        return null; 
        });
}

const Flights = () => {
    const flightResults = findFlights();
      return (
        <div>
            <h1>Suggested Flights</h1>
        </div>
        // <div className="flights">
        //   <h1>Flight Search Results</h1>
        //   <div className="itineraries">
        //     <h2>Itineraries</h2>
        //     {renderItineraries()}
        //   </div>
        //   <div className="legs">
        //     <h2>Legs</h2>
        //     {renderLegs()}
        //   </div>
        //   <div className="segments">
        //     <h2>Segments</h2>
        //     {renderSegments()}
        //   </div>
        // </div>
      );
}; 

export default Flights;