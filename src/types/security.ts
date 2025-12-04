export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'normal';

export type AttackType = 
  | 'Possible DDoS'
  | 'Suspicious Host'
  | 'AI Flagged Anomaly'
  | 'High Risk IP'
  | 'Normal'
  | 'Large Packet';

export interface NetworkLog {
  id: string;
  timestamp: Date;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  packetSize: number;
  browser: string;
  country: string;
  abuseScore: number;
  severity: Severity;
  requestCount: number;
  hostName: string;
  serverLocation: string;
  attackType: AttackType;
}

export interface Alert {
  id: string;
  timestamp: Date;
  sourceIP: string;
  attackType: AttackType;
  aiPrediction: 'malicious' | 'safe';
  blockchainVerified: boolean;
  severity: Severity;
  details: string;
}

export interface AnomalyData {
  high: number;
  medium: number;
  low: number;
  normal: number;
}

export interface NetworkTrafficPoint {
  time: string;
  traffic: number;
  threats: number;
}

export interface IPLocation {
  ip: string;
  lat: number;
  lng: number;
  country: string;
  severity: Severity;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface FilterState {
  attackTypes: AttackType[];
  severities: Severity[];
}
