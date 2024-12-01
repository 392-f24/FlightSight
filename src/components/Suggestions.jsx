import React, { useState } from 'react';
import { matchPreferences } from '../utilities/matching';
import './Suggestions.css';

const locationList = [
    { name: 'Location 1', price: 100, distance: 50 },
    { name: 'Location 2', price: 150, distance: 15 },
    { name: 'Location 3', price: 120, distance: 20 }
];

const Suggestions = () => {
    const [submitted, setSubmitted] = useState(false);
    const [sortedLocationList, setSortedLocationList] = useState([]);

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

    return (
        <div className='suggestion-div'>
            <h1>Flight Suggestions</h1>
            <div className='preference-select-div'>
                <h3>Rank Your Preferences (1 = Most Preferred, 3 = Least Preferred)</h3>
                <form onSubmit={handleSubmit}>
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
                        <button type="submit">Submit Rankings</button>
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
                                - Price: ${location.price}, Distance: {location.distance} km
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Suggestions;
