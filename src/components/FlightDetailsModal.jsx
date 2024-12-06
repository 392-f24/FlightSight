import React from "react";
import "./FlightDetailsModal.css";

const FlightDetailsModal = ({ flight, onClose }) => {
  if (!flight) return null; // Don't render if no flight is passed

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Flight Details</h2>
        <p><strong>Airline:</strong> {flight.flights[0]?.airline || "Unknown Airline"}</p>
        <p><strong>Departure:</strong> {flight.flights[0]?.departure_airport?.time || "N/A"}</p>
        <p><strong>Arrival:</strong> {flight.flights[0]?.arrival_airport?.time || "N/A"}</p>
        <p><strong>Price:</strong> ${flight.price.toFixed(2)}</p>
        {flight.bookingLink && (
          <a
            href={flight.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white" }}
            className="book-button"
          >
            Book Now
          </a>
        )}
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default FlightDetailsModal;