import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PriceCalendar.css';

const localizer = momentLocalizer(moment);

const PriceCalendar = ({ priceData }) => {
    const [dates, setDates] = useState([]);
    const [bestDate, setBestDate] = useState(null);
    const [worstDate, setWorstDate] = useState(null);

    useEffect(() => {
        const flightDates = priceData.map(({ date, price }) => {
            const flightDate = moment(date, 'YYYY-MM-DD').toDate();

            return {
                title: `$${price.toFixed(2)}`,
                start: flightDate,
                end: flightDate,
                price,
            };
        });
        setDates(flightDates);

        const minPrice = Math.min(...priceData.map(d => d.price));
        const maxPrice = Math.max(...priceData.map(d => d.price));

        const bestDeal = priceData.find(d => d.price === minPrice);
        const worstDeal = priceData.find(d => d.price === maxPrice);

        setBestDate(bestDeal.date);
        setWorstDate(worstDeal.date);
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

    const formatDate = (date) => moment(date).format('MMMM Do YYYY');

    return (
        <div className="calendar-container">
            <h1>Flight Prices</h1>
            
            {bestDate && worstDate && (
                <div className="deal-summary">
                    <p>
                        <strong>Best Deal:</strong> {formatDate(bestDate)} ({`$${Math.min(...priceData.map(d => d.price)).toFixed(2)}`})
                    </p>
                    <p>
                        <strong>Worst Deal:</strong> {formatDate(worstDate)} ({`$${Math.max(...priceData.map(d => d.price)).toFixed(2)}`})
                    </p>
                </div>
            )}

            <div className="calendar">
                <Calendar
                    localizer={localizer}
                    events={dates}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ width: '100%', height: '100%' }}
                    views={['month']}
                    eventPropGetter={flightDateStyle}
                />
            </div>
        </div>
    );
};

export default PriceCalendar;
