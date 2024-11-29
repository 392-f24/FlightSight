const normalize = (value, maxValue) => {
    return value / maxValue;
}

const calculatePricePerDistance = (price, distance) => {
    return distance === 0 ? 0 : price / distance;
}

const applyWeighting = (score, weight) => {
    return score * weight;
}

const matchLocation = (userPreferences, location, maxPricePerDistance, maxDistance, maxPrice) => {
    const locationPricePerDistance = calculatePricePerDistance(location.price, location.distance);

    const normalizedLocationPricePerDistance = normalize(locationPricePerDistance, maxPricePerDistance);
    const normalizedLocationDistance = normalize(location.distance, maxDistance);
    const normalizedPrice = normalize(location.price, maxPrice)

    const priceWeight = userPreferences.price === 1 ? 1 : userPreferences.price === 2 ? 0.7 : 0.5;
    const distanceWeight = userPreferences.distance === 1 ? 1 : userPreferences.distance === 2 ? 0.7 : 0.5;
    const valueWeight = userPreferences.value === 1 ? 1 : userPreferences.value === 2 ? 0.7: 0.5;

    const weightedValueScore = applyWeighting(normalizedLocationPricePerDistance, valueWeight);
    const weightedPriceScore = applyWeighting(normalizedPrice, priceWeight);
    const weightedDistanceScore = applyWeighting(normalizedLocationDistance, distanceWeight);

    const totalScore = weightedPriceScore + weightedDistanceScore + weightedValueScore;

    return totalScore;
}

export const matchPreferences = (locationList, preferences) => {
    const maxPricePerDistance = Math.max(...locationList.map(location => calculatePricePerDistance(location.price, location.distance)));
    const maxDistance = Math.max(...locationList.map(location => location.distance));
    const maxPrice = Math.max(...locationList.map(location => location.price))

    const sortedLocations = locationList
        .map(location => ({
            ...location,
            pricePerDistance: calculatePricePerDistance(location.price, location.distance),
            score: matchLocation(preferences, location, maxPricePerDistance, maxDistance, maxPrice)
        }))
        .sort((a, b) => a.score - b.score);

    return sortedLocations;
}
