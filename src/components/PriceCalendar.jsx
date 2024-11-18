import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PriceCalendar.css';

const localizer = momentLocalizer(moment);

const PriceCalendar = ({ priceData, onDateClick }) => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const flightDates = priceData.map(({ date, price }) => {
            const flightDate = moment(date, 'YYYY-MM-DD').toDate();

            return {
                title: `$${price.toFixed(2)}`,
                start: flightDate,
                end: flightDate,
                price,
                date,
            };
        });
        setDates(flightDates);
    }, [priceData]);

    const flightDateStyle = (event) => {
        const normalized = (event.price - Math.min(...priceData.map(d => d.price))) /
            (Math.max(...priceData.map(d => d.price)) - Math.min(...priceData.map(d => d.price)));

        const r = Math.floor(255 * normalized);
        const g = Math.floor(255 * (1 - normalized));

        return {
            style: {
                backgroundColor: `rgb(${r}, ${g}, 0)`,
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                textAlign: 'center',
                padding: '4px',
            },
        };
    };

    const handleDateSelect = (event) => {
        const selectedDate = event.start;
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
        onDateClick(formattedDate);
    };

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={dates}
                startAccessor="start"
                endAccessor="end"
                style={{ width: '100%', height: '100%' }}
                views={['month']}
                eventPropGetter={flightDateStyle}
                onSelectEvent={handleDateSelect}
            />
        </div>
    );
};

export default PriceCalendar;
