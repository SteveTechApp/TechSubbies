// A very simple mock distance calculator for the UK (distances are approximate in miles)
const UK_CITIES_DISTANCES: Record<string, Record<string, number>> = {
    'london': { 'manchester': 200, 'birmingham': 120, 'leeds': 200, 'bristol': 120, 'edinburgh': 400, 'glasgow': 410, 'cardiff': 150, 'belfast': 400 },
    'manchester': { 'london': 200, 'birmingham': 85, 'leeds': 40, 'liverpool': 35, 'glasgow': 215, 'edinburgh': 220, 'newcastle': 145 },
    'birmingham': { 'london': 120, 'manchester': 85, 'bristol': 90, 'leeds': 120, 'cardiff': 100 },
    'leeds': { 'london': 200, 'manchester': 40, 'birmingham': 120, 'newcastle': 100, 'sheffield': 35 },
    'bristol': { 'london': 120, 'birmingham': 90, 'cardiff': 45 },
    'glasgow': { 'edinburgh': 45, 'manchester': 215, 'newcastle': 150 },
    'edinburgh': { 'glasgow': 45, 'manchester': 220, 'newcastle': 120 },
    'cardiff': { 'london': 150, 'birmingham': 100, 'bristol': 45 },
};

/**
 * Calculates the approximate distance between two locations based on their city name.
 * @param location1 A string like "City, Country"
 * @param location2 A string like "City, Country"
 * @returns The distance in miles, or null if the cities are not in the matrix.
 */
export const getDistance = (location1: string, location2: string): number | null => {
    if (!location1 || !location2) return null;

    const city1 = location1.split(',')[0].trim().toLowerCase();
    const city2 = location2.split(',')[0].trim().toLowerCase();

    if (city1 === city2) return 0;

    if (UK_CITIES_DISTANCES[city1] && UK_CITIES_DISTANCES[city1][city2] !== undefined) {
        return UK_CITIES_DISTANCES[city1][city2];
    }
    if (UK_CITIES_DISTANCES[city2] && UK_CITIES_DISTANCES[city2][city1] !== undefined) {
        return UK_CITIES_DISTANCES[city2][city1];
    }
    
    // If not in our matrix, return a generic large distance for filtering purposes
    return 9999;
};