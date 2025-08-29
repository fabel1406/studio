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
      { name: 'A Coruña' }, { name: 'Albacete' }, { name: 'Alicante' }, { name: 'Almería' }, { name: 'Ávila' },
      { name: 'Badajoz' }, { name: 'Barcelona' }, { name: 'Bilbao' }, { name: 'Burgos' }, { name: 'Cáceres' },
      { name: 'Cádiz' }, { name: 'Castellón de la Plana' }, { name: 'Ciudad Real' }, { name: 'Córdoba' }, { name: 'Cuenca' },
      { name: 'Girona' }, { name: 'Granada' }, { name: 'Guadalajara' }, { name: 'Huelva' }, { name: 'Huesca' },
      { name: 'Jaén' }, { name: 'León' }, { name: 'Lleida' }, { name: 'Logroño' }, { name: 'Lugo' },
      { name: 'Madrid' }, { name: 'Málaga' }, { name: 'Murcia' }, { name: 'Ourense' }, { name: 'Oviedo' },
      { name: 'Palencia' }, { name: 'Palma de Mallorca' }, { name: 'Pamplona' }, { name: 'Pontevedra' }, { name: 'Salamanca' },
      { name: 'San Sebastián' }, { name: 'Santa Cruz de Tenerife' }, { name: 'Santander' }, { name: 'Segovia' }, { name: 'Sevilla' },
      { name: 'Soria' }, { name: 'Tarragona' }, { name: 'Teruel' }, { name: 'Toledo' }, { name: 'Valencia' },
      { name: 'Valladolid' }, { name: 'Vitoria-Gasteiz' }, { name: 'Zamora' }, { name: 'Zaragoza' },
    ],
  },
  {
    name: 'Portugal',
    code: 'PT',
    cities: [
        { name: 'Aveiro' }, { name: 'Beja' }, { name: 'Braga' }, { name: 'Bragança' }, { name: 'Castelo Branco' },
        { name: 'Coimbra' }, { name: 'Évora' }, { name: 'Faro' }, { name: 'Funchal' }, { name: 'Guarda' },
        { name: 'Leiria' }, { name: 'Lisboa' }, { name: 'Ponta Delgada' }, { name: 'Portalegre' }, { name: 'Oporto' },
        { name: 'Santarém' }, { name: 'Setúbal' }, { name: 'Viana do Castelo' }, { name: 'Vila Real' }, { name: 'Viseu' },
    ],
  },
  {
    name: 'Francia',
    code: 'FR',
    cities: [
        { name: 'Amiens' }, { name: 'Angers' }, { name: 'Burdeos' }, { name: 'Clermont-Ferrand' }, { name: 'Dijon' },
        { name: 'Estrasburgo' }, { name: 'Grenoble' }, { name: 'Le Havre' }, { name: 'Lille' }, { name: 'Lyon' },
        { name: 'Marsella' }, { name: 'Montpellier' }, { name: 'Nantes' }, { name: 'Niza' }, { name: 'Nimes' },
        { name: 'París' }, { name: 'Reims' }, { name: 'Rennes' }, { name: 'Saint-Étienne' }, { name: 'Toulon' },
        { name: 'Toulouse' },
    ],
  },
  {
    name: 'Italia',
    code: 'IT',
    cities: [
        { name: 'Bari' }, { name: 'Bolonia' }, { name: 'Cagliari' }, { name: 'Catania' }, { name: 'Florencia' },
        { name: 'Génova' }, { name: 'Mesina' }, { name: 'Milán' }, { name: 'Nápoles' }, { name: 'Palermo' },
        { name: 'Regio de Calabria' }, { name: 'Roma' }, { name: 'Salerno' }, { name: 'Tarento' }, { name: 'Trieste' },
        { name: 'Turín' }, { name: 'Verona' },
    ],
  },
  {
    name: 'Alemania',
    code: 'DE',
    cities: [
        { name: 'Berlín' }, { name: 'Bielefeld' }, { name: 'Bochum' }, { name: 'Bonn' }, { name: 'Bremen' },
        { name: 'Colonia' }, { name: 'Dortmund' }, { name: 'Dresde' }, { name: 'Duisburgo' }, { name: 'Düsseldorf' },
        { name: 'Essen' }, { name: 'Fráncfort del Meno' }, { name: 'Hamburgo' }, { name: 'Hannover' }, { name: 'Leipzig' },
        { name: 'Mannheim' }, { name: 'Múnich' }, { name: 'Núremberg' }, { name: 'Stuttgart' }, { name: 'Wuppertal' },
    ],
  },
];

countries.forEach(country => {
  country.cities.sort((a, b) => a.name.localeCompare(b.name));
});

export const getAllCountries = () => countries.sort((a, b) => a.name.localeCompare(b.name));

export const getCitiesByCountry = (countryName: string): City[] => {
  const country = countries.find(c => c.name === countryName);
  return country ? country.cities : [];
};
