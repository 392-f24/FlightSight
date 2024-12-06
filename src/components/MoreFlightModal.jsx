import React from "react";
import "./MoreFlightModal.css";

const MoreFlightsModal = ({ flights, onClose, onFlightClick }) => {
  if (!flights || flights.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Flights for {flights[0]?.date}</h2>
        <ul>
          {flights.map((flight, index) => (
            <li
              key={index}
              onClick={() => onFlightClick(flight)} // Open flight details modal
              style={{ cursor: "pointer", margin: "10px 0" }}
            >
              ${flight.price.toFixed(2)} - {flight.flights[0]?.airline || "Unknown Airline"}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default MoreFlightsModal;