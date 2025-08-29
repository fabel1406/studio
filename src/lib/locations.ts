// src/lib/locations.ts

export interface City {
  name: string;
}

export interface Country {
  name: string;
  code: string;
  cities: City[];
}

export const countries: Country[] = [
  {
    name: 'España',
    code: 'ES',
    cities: [
      { name: 'Barcelona' },
      { name: 'Jaén' },
      { name: 'Logroño' },
      { name: 'Lugo' },
      { name: 'Madrid' },
      { name: 'Murcia' },
      { name: 'Valencia' },
      { name: 'Sevilla' },
    ],
  },
  {
    name: 'Portugal',
    code: 'PT',
    cities: [
      { name: 'Lisboa' },
      { name: 'Oporto' },
      { name: 'Faro' },
    ],
  },
  {
    name: 'Francia',
    code: 'FR',
    cities: [
      { name: 'París' },
      { name: 'Marsella' },
      { name: 'Lyon' },
      { name: 'Toulouse' },
    ],
  },
  {
    name: 'Italia',
    code: 'IT',
    cities: [
      { name: 'Roma' },
      { name: 'Milán' },
      { name: 'Nápoles' },
      { name: 'Turín' },
    ],
  },
  {
    name: 'Alemania',
    code: 'DE',
    cities: [
      { name: 'Berlín' },
      { name: 'Hamburgo' },
      { name: 'Múnich' },
      { name: 'Colonia' },
    ],
  },
];

countries.forEach(country => {
  country.cities.sort((a, b) => a.name.localeCompare(b.name));
});

export const getAllCountries = () => countries;

export const getCitiesByCountry = (countryName: string): City[] => {
  const country = countries.find(c => c.name === countryName);
  return country ? country.cities : [];
};
