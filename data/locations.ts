
export interface LocationData {
  name: string;
  type: 'Special' | 'Continent' | 'Sub-Region' | 'Country' | 'City';
  parent?: string; // Name of the parent region/continent
}

// A sample dataset to demonstrate the feature. A real app would use a more comprehensive database or API.
export const LOCATIONS_DATA: LocationData[] = [
    // Special
    { name: 'Worldwide', type: 'Special' },
    { name: 'Remote', type: 'Special' },

    // Continents
    { name: 'Europe', type: 'Continent' },
    { name: 'North America', type: 'Continent' },
    { name: 'Asia', type: 'Continent' },
    { name: 'South America', type: 'Continent' },
    { name: 'Africa', type: 'Continent' },
    { name: 'Oceania', type: 'Continent' },

    // Sub-Regions
    { name: 'Western Europe', type: 'Sub-Region', parent: 'Europe' },
    { name: 'Northan Europe', type: 'Sub-Region', parent: 'Europe' },
    { name: 'Southern Europe', type: 'Sub-Region', parent: 'Europe' },
    { name: 'Eastern Asia', type: 'Sub-Region', parent: 'Asia' },
    { name: 'Southeast Asia', type: 'Sub-Region', parent: 'Asia' },

    // Countries
    { name: 'United Kingdom', type: 'Country', parent: 'Western Europe' },
    { name: 'United States', type: 'Country', parent: 'North America' },
    { name: 'Canada', type: 'Country', parent: 'North America' },
    { name: 'France', type: 'Country', parent: 'Western Europe' },
    { name: 'Germany', type: 'Country', parent: 'Western Europe' },
    { name: 'Ireland', type: 'Country', parent: 'Western Europe' },
    { name: 'Spain', type: 'Country', parent: 'Southern Europe' },
    { name: 'Italy', type: 'Country', parent: 'Southern Europe' },
    { name: 'Japan', type: 'Country', parent: 'Eastern Asia' },
    { name: 'Singapore', type: 'Country', parent: 'Southeast Asia' },
    { name: 'Australia', type: 'Country', parent: 'Oceania' },

    // Major Cities
    { name: 'London, UK', type: 'City', parent: 'United Kingdom' },
    { name: 'Manchester, UK', type: 'City', parent: 'United Kingdom' },
    { name: 'Birmingham, UK', type: 'City', parent: 'United Kingdom' },
    { name: 'Edinburgh, UK', type: 'City', parent: 'United Kingdom' },
    { name: 'New York, USA', type: 'City', parent: 'United States' },
    { name: 'Los Angeles, USA', type: 'City', parent: 'United States' },
    { name: 'Chicago, USA', type: 'City', parent: 'United States' },
    { name: 'Toronto, Canada', type: 'City', parent: 'Canada' },
    { name: 'Paris, France', type: 'City', parent: 'France' },
    { name: 'Berlin, Germany', type: 'City', parent: 'Germany' },
    { name: 'Dublin, Ireland', type: 'City', parent: 'Ireland' },
    { name: 'Madrid, Spain', type: 'City', parent: 'Spain' },
    { name: 'Rome, Italy', type: 'City', parent: 'Italy' },
    { name: 'Tokyo, Japan', type: 'City', parent: 'Japan' },
    { name: 'Sydney, Australia', type: 'City', parent: 'Australia' },
];
