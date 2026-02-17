export enum RoadUserType {
  CYCLIST = 'Fietser',
  PEDESTRIAN = 'Voetganger',
  UNKNOWN = 'Onbekend'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  date?: string;
}

export interface Accident {
  id: string;
  date: string;
  locationName: string;
  coordinates: Coordinates;
  type: RoadUserType;
  description: string;
  severity: 'Fatal' | 'Critical';
  source: 'Official' | 'User_Verified';
}

export interface AnalysisResult {
  accidentId: string;
  content: string;
  isLoading: boolean;
}

export interface DraftAccident extends Omit<Accident, 'id' | 'source'> {
  isValid: boolean;
}