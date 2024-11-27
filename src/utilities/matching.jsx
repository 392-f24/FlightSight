export const matchPreferences = (locationList, preferences) => {
    const calculateMatchScore = (location) => {
        let score = 0;
        for (const [key, { value, weight }] of Object.entries(preferences)) {
            if (location[key] !== undefined) {
                const diff = Math.abs(location[key] - value);
                score += (1 / (1 + diff)) * weight;
            }
        }

        console.log(location.name, score);
        return score;
    };

    const locationsWithScores = locationList.map(location => ({
        ...location,
        score: calculateMatchScore(location)
    }));

    console.log("Before sorting:", locationsWithScores);

    return locationsWithScores
        .sort((a, b) => b.score - a.score)
        .map(({ score, ...rest }) => rest);
};
