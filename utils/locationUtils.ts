
import { LOCATIONS_DATA, LocationData } from '../data/locations';

// A very simple mock distance calculator (distances are approximate in miles)
const WORLD_CITIES_DISTANCES: Record<string, Record<string, number>> = {
    'london': { 'manchester': 200, 'birmingham': 120, 'paris': 215, 'dublin': 290, 'berlin': 580 },
    'manchester': { 'london': 200, 'birmingham': 85, 'leeds': 40, 'liverpool': 35, 'glasgow': 215 },
    'paris': { 'london': 215, 'berlin': 545, 'madrid': 650 },
    'new york': { 'chicago': 790, 'los angeles': 2800, 'toronto': 490, 'london': 3460 },
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

    if (WORLD_CITIES_DISTANCES[city1] && WORLD_CITIES_DISTANCES[city1][city2] !== undefined) {
        return WORLD_CITIES_DISTANCES[city1][city2];
    }
    if (WORLD_CITIES_DISTANCES[city2] && WORLD_CITIES_DISTANCES[city2][city1] !== undefined) {
        return WORLD_CITIES_DISTANCES[city2][city1];
    }
    
    // If not in our matrix, return a generic large distance for filtering purposes
    return 9999;
};

/**
 * Recursively finds all locations within a given parent region.
 * @param regionName The name of the parent region (e.g., "Europe").
 * @returns An array of location names including the region itself and all its children.
 */
export const findLocationsInRegion = (regionName: string): string[] => {
    const region = LOCATIONS_DATA.find(l => l.name.toLowerCase() === regionName.toLowerCase());
    if (!region) return [regionName]; // Return the name itself if not found in data

    const results = new Set<string>([region.name]);
    const queue: LocationData[] = [region];
    
    while(queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;
        
        const children = LOCATIONS_DATA.filter(l => l.parent === current.name);
        for(const child of children) {
            results.add(child.name);
            if(child.type !== 'City') {
                queue.push(child);
            }
        }
    }
    return Array.from(results);
};
