import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./PriceCalendar.css";

const localizer = momentLocalizer(moment);

const PriceCalendar = ({ priceData, onDateClick, onPriceClick, onMoreClick }) => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // Prepare the flight dates with additional metadata
    const flightDates = priceData.map(({ date, price, ...flight }) => {
      const flightDate = moment(date, "YYYY-MM-DD").toDate();

      return {
        title: `$${price.toFixed(2)}`,
        start: flightDate,
        end: flightDate,
        price,
        date,
        ...flight, // Pass all other flight details for modal use
      };
    });
    setDates(flightDates);
  }, [priceData]);

  const flightDateStyle = (event) => {
    // Normalize prices for color scaling
    const minPrice = Math.min(...priceData.map((d) => d.price));
    const maxPrice = Math.max(...priceData.map((d) => d.price));
    const normalized = (event.price - minPrice) / (maxPrice - minPrice);

    const r = Math.floor(255 * normalized); // More expensive = red
    const g = Math.floor(255 * (1 - normalized)); // Less expensive = green

    return {
      style: {
        backgroundColor: `rgb(${r}, ${g}, 0)`,
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        textAlign: "center",
        padding: "4px",
        cursor: "pointer", // Indicate clickable items
      },
    };
  };

  const handleDateSelect = (event) => {
    const selectedDate = event.start;
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    onDateClick(formattedDate); // Callback for date-specific logic
  };

  const handleEventClick = (event) => {
    onPriceClick(event); // Pass the selected event (flight) to the parent for modal handling
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={dates}
        startAccessor="start"
        endAccessor="end"
        style={{ width: "100%", height: "100%" }}
        views={["month"]}
        eventPropGetter={flightDateStyle}
        onSelectEvent={handleEventClick} // Handle clicks on flight prices
        components={{
          event: ({ event }) => (
            <div>
              <span onClick={() => onPriceClick(event)}>{event.title}</span>
              {event.moreCount > 0 && (
                <button
                  className="more-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering other events
                    onMoreClick(event.date); // Pass the date to the parent
                  }}
                >
                  +{event.moreCount} more
                </button>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default PriceCalendar;