import { Accident, RoadUserType } from './types';

// Coordinates centered roughly on Flanders
export const FLANDERS_CENTER: [number, number] = [51.05, 4.40]; 
export const DEFAULT_ZOOM = 9;

// Simulating a larger public dataset from "Vlaams Verkeerscentrum"
export const SEED_ACCIDENTS: Accident[] = [
  // ANTWERPEN
  {
    id: 'ant-001',
    date: '2023-11-15',
    locationName: 'Antwerpen, Plantin en Moretuslei',
    coordinates: { lat: 51.212, lng: 4.425 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding met vrachtwagen bij afslaan (dode hoek).',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'ant-002',
    date: '2023-11-05',
    locationName: 'Antwerpen, De Leien',
    coordinates: { lat: 51.218, lng: 4.415 },
    type: RoadUserType.CYCLIST,
    description: 'Conflict fietser en taxi op kruispunt.',
    severity: 'Critical',
    source: 'Official'
  },
  {
    id: 'ant-003',
    date: '2024-01-12',
    locationName: 'Borgerhout, Turnhoutsebaan',
    coordinates: { lat: 51.214, lng: 4.438 },
    type: RoadUserType.PEDESTRIAN,
    description: 'Voetganger aangereden tijdens oversteken buiten zebrapad.',
    severity: 'Fatal',
    source: 'Official'
  },
  
  // GENT
  {
    id: 'gnt-001',
    date: '2023-10-02',
    locationName: 'Gent, Dampoort',
    coordinates: { lat: 51.056, lng: 3.741 },
    type: RoadUserType.CYCLIST,
    description: 'Conflict tussen fietser en bus op rotonde.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'gnt-002',
    date: '2023-09-15',
    locationName: 'Gent, Korenmarkt',
    coordinates: { lat: 51.054, lng: 3.722 },
    type: RoadUserType.PEDESTRIAN,
    description: 'Aanrijding door tram.',
    severity: 'Critical',
    source: 'Official'
  },
  {
    id: 'gnt-003',
    date: '2024-02-18',
    locationName: 'Gent, Sterre',
    coordinates: { lat: 51.026, lng: 3.712 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding op fietsoversteekplaats.',
    severity: 'Fatal',
    source: 'Official'
  },

  // LIMBURG (Hasselt/Genk)
  {
    id: 'lim-001',
    date: '2024-01-10',
    locationName: 'Hasselt, Grote Ring',
    coordinates: { lat: 50.930, lng: 5.338 },
    type: RoadUserType.PEDESTRIAN,
    description: 'Overstekende voetganger aangereden door personenwagen bij slecht zicht.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'lim-002',
    date: '2024-03-12',
    locationName: 'Genk, Europalaan',
    coordinates: { lat: 50.965, lng: 5.500 },
    type: RoadUserType.PEDESTRIAN,
    description: 'Aanrijding bij oversteken drukke baan.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'lim-003',
    date: '2023-08-22',
    locationName: 'Houthalen-Helchteren, Grote Baan',
    coordinates: { lat: 51.033, lng: 5.375 },
    type: RoadUserType.CYCLIST,
    description: 'Ongeval op fietspad langs gewestweg.',
    severity: 'Fatal',
    source: 'Official'
  },

  // VLAAMS-BRABANT (Leuven/Halle)
  {
    id: 'vlb-001',
    date: '2023-12-24',
    locationName: 'Leuven, Ring',
    coordinates: { lat: 50.879, lng: 4.701 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding op fietspad door afslaand voertuig.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'vlb-002',
    date: '2023-11-10',
    locationName: 'Leuven, Naamsesteenweg',
    coordinates: { lat: 50.865, lng: 4.698 },
    type: RoadUserType.CYCLIST,
    description: 'Dooring incident met bus.',
    severity: 'Critical',
    source: 'Official'
  },
  {
    id: 'vlb-003',
    date: '2024-01-05',
    locationName: 'Vilvoorde, Woluwelaan',
    coordinates: { lat: 50.925, lng: 4.430 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding op rotonde.',
    severity: 'Fatal',
    source: 'Official'
  },

  // WEST-VLAANDEREN (Brugge/Oostende/Kortrijk)
  {
    id: 'wvl-001',
    date: '2023-09-18',
    locationName: 'Brugge, Scheepsdalelaan',
    coordinates: { lat: 51.215, lng: 3.210 },
    type: RoadUserType.PEDESTRIAN,
    description: 'Ongeval op zebrapad.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'wvl-002',
    date: '2023-08-30',
    locationName: 'Oostende, Torhoutsesteenweg',
    coordinates: { lat: 51.220, lng: 2.910 },
    type: RoadUserType.CYCLIST,
    description: 'Conflict bij uitrit supermarkt.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'wvl-003',
    date: '2024-01-20',
    locationName: 'Kortrijk, Oudenaardsesteenweg',
    coordinates: { lat: 50.825, lng: 3.280 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding door voertuig dat geen voorrang verleende.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'wvl-004',
    date: '2023-12-12',
    locationName: 'Roeselare, Rijksweg',
    coordinates: { lat: 50.945, lng: 3.120 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding vrachtwagen.',
    severity: 'Fatal',
    source: 'Official'
  },

  // OOST-VLAANDEREN (Sint-Niklaas/Aalst)
  {
    id: 'ovl-001',
    date: '2023-11-05',
    locationName: 'Sint-Niklaas, N70',
    coordinates: { lat: 51.165, lng: 4.140 },
    type: RoadUserType.CYCLIST,
    description: 'Dooring ongeval met fatale afloop.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'ovl-002',
    date: '2024-02-05',
    locationName: 'Aalst, Parklaan',
    coordinates: { lat: 50.935, lng: 4.040 },
    type: RoadUserType.PEDESTRIAN,
    description: 'Aanrijding bij oversteken.',
    severity: 'Critical',
    source: 'Official'
  },
  {
    id: 'ovl-003',
    date: '2023-10-22',
    locationName: 'Lokeren, N47',
    coordinates: { lat: 51.105, lng: 3.990 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding op kruispunt.',
    severity: 'Fatal',
    source: 'Official'
  },
  
  // EXTRA POINTS (Mechelen/Turnhout)
  {
    id: 'ant-004',
    date: '2024-02-05',
    locationName: 'Mechelen, N1',
    coordinates: { lat: 51.025, lng: 4.478 },
    type: RoadUserType.CYCLIST,
    description: 'Aanrijding op onverlichte weg.',
    severity: 'Fatal',
    source: 'Official'
  },
  {
    id: 'ant-005',
    date: '2023-11-28',
    locationName: 'Turnhout, Ringlaan',
    coordinates: { lat: 51.320, lng: 4.940 },
    type: RoadUserType.CYCLIST,
    description: 'Ongeval rotonde.',
    severity: 'Critical',
    source: 'Official'
  }
];