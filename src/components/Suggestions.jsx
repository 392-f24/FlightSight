import React, { useState } from 'react';
import { matchPreferences } from '../utilities/matching';
import './Suggestions.css';

const locationList = [
    { name: 'Tokyo, Japan', price: 721, distance: 6300 },
    { name: 'Barcelona, Spain', price: 506, distance: 4420 },
    { name: 'Barcelona, Spain', price: 640, distance: 4420 },
    { name: 'Hawaii, USA', price: 745, distance: 4194 },
    { name: 'Hawaii, USA', price: 824, distance: 4194 }
];

const Suggestions = () => {
    const [submitted, setSubmitted] = useState(false);
    const [sortedLocationList, setSortedLocationList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const suggestionsList = [
        'Flight price',
        'Flight distance',
        'Cost-effectiveness'
    ];

    const [rankings, setRankings] = useState({
        1: null,
        2: null,
        3: null
    });

    const handleRankChange = (event, rank) => {
        const selectedSuggestion = event.target.value;
        const updatedRankings = { ...rankings, [rank]: selectedSuggestion };
        Object.keys(updatedRankings).forEach((key) => {
            if (key !== rank && updatedRankings[key] === selectedSuggestion) {
                updatedRankings[key] = null;
            }
        });

        setRankings(updatedRankings);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const preferences = {
            price: null,
            distance: null,
            value: null
        };
        Object.keys(rankings).forEach((rank) => {
            const selectedSuggestion = rankings[rank];
    
            switch (selectedSuggestion) {
                case 'Flight price':
                    preferences.price = parseInt(rank);
                    break;
                case 'Flight distance':
                    preferences.distance = parseInt(rank);
                    break;
                case 'Cost-effectiveness':
                    preferences.value = parseInt(rank);
                    break;
                default:
                    break;
            }
        });

        const sortedLocations = matchPreferences(locationList, preferences);
        setSortedLocationList(sortedLocations);
        setSubmitted(true);
    };

    const handleBookingClick = (location) => {
        setSelectedLocation(location);
        setModalVisible(true); // Show modal
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Hide modal
        setSelectedLocation(null);
    };

    return (
        <div className='suggestion-div'>
            <h1>Flight Suggestions</h1>
            <input
                        type="text"
                        id="flight-type"
                        placeholder="What type of location are you looking for?"
                        className='location-prompt'
                    />
            <div className='preference-select-div'>
                <h3>Rank Your Preferences (1 = Most Preferred, 3 = Least Preferred)</h3>
                <form className='suggestion-form' onSubmit={handleSubmit}>
                    {Object.keys(rankings).map((rank) => (
                        <div key={rank}>
                            <label>Rank {rank}:</label>
                            <select
                                value={rankings[rank] || ''}
                                onChange={(e) => handleRankChange(e, rank)}
                            >
                                <option value="">Select a suggestion</option>
                                {suggestionsList.map((suggestion) => (
                                    <option key={suggestion} value={suggestion}>
                                        {suggestion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <div>
                        <button className='suggestion-button' type="submit">Submit Rankings</button>
                    </div>
                </form>
            </div>
            
            {submitted && sortedLocationList.length > 0 && (
                <div className="sorted-locations">
                    <h3>Sorted Locations Based on Your Preferences:</h3>
                    <ul>
                        {sortedLocationList.map((location, index) => (
                            <li key={index}>
                                <strong>{location.name}</strong> 
                                - Price: ${location.price}, Distance: {location.distance} miles
                                <button className='modal-button' onClick={() => handleBookingClick(location)}>Booking</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {modalVisible && selectedLocation && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Booking Details</h2>
                        <p><strong>Location:</strong> {selectedLocation.name}</p>
                        <p><strong>Price:</strong> ${selectedLocation.price}</p>
                        <p><strong>Distance:</strong> {selectedLocation.distance} miles</p>
                        <button className='modal-button' onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suggestions;