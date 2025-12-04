import { NetworkLog, Alert, NetworkTrafficPoint, IPLocation, AnomalyData, Severity, AttackType } from '@/types/security';

const attackTypes: AttackType[] = ['Possible DDoS', 'Suspicious Host', 'AI Flagged Anomaly', 'High Risk IP', 'Normal', 'Large Packet'];
const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'normal'];
const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'FTP', 'SSH', 'DNS'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Unknown'];
const countries = ['United States', 'China', 'Russia', 'Germany', 'Brazil', 'India', 'Japan', 'UK', 'France', 'Australia'];
const serverLocations = ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific', 'South America'];

const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

const generateRandomHostname = (): string => {
  const prefixes = ['web', 'api', 'cdn', 'mail', 'proxy', 'app', 'db', 'cache'];
  const domains = ['example.com', 'server.net', 'host.io', 'cloud.dev', 'service.org'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${Math.floor(Math.random() * 100)}.${domains[Math.floor(Math.random() * domains.length)]}`;
};

export const generateNetworkLogs = (count: number): NetworkLog[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `log-${i + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    sourceIP: generateRandomIP(),
    destinationIP: generateRandomIP(),
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    packetSize: Math.floor(Math.random() * 65000) + 64,
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    abuseScore: Math.floor(Math.random() * 100),
    severity: severities[Math.floor(Math.random() * severities.length)],
    requestCount: Math.floor(Math.random() * 1000) + 1,
    hostName: generateRandomHostname(),
    serverLocation: serverLocations[Math.floor(Math.random() * serverLocations.length)],
    attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
  }));
};

export const generateAlerts = (count: number): Alert[] => {
  return Array.from({ length: count }, (_, i) => {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const isMalicious = Math.random() > 0.5;
    return {
      id: `alert-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 1800000),
      sourceIP: generateRandomIP(),
      attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      aiPrediction: isMalicious ? 'malicious' : 'safe',
      blockchainVerified: Math.random() > 0.3,
      severity,
      details: isMalicious 
        ? `Suspicious activity detected from IP. ${Math.floor(Math.random() * 100)} requests in last minute.`
        : `Traffic pattern verified. Normal behavior observed.`,
    };
  });
};

export const generateNetworkTraffic = (points: number): NetworkTrafficPoint[] => {
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(Date.now() - (points - i) * 60000);
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      traffic: Math.floor(Math.random() * 800) + 200,
      threats: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0,
    };
  });
};

export const generateAnomalyData = (): AnomalyData => ({
  high: Math.floor(Math.random() * 20) + 5,
  medium: Math.floor(Math.random() * 40) + 10,
  low: Math.floor(Math.random() * 60) + 20,
  normal: Math.floor(Math.random() * 100) + 100,
});

export const generateIPLocations = (count: number): IPLocation[] => {
  const locationCoords: { country: string; lat: number; lng: number }[] = [
    { country: 'United States', lat: 39.8283, lng: -98.5795 },
    { country: 'China', lat: 35.8617, lng: 104.1954 },
    { country: 'Russia', lat: 61.524, lng: 105.3188 },
    { country: 'Germany', lat: 51.1657, lng: 10.4515 },
    { country: 'Brazil', lat: -14.235, lng: -51.9253 },
    { country: 'India', lat: 20.5937, lng: 78.9629 },
    { country: 'Japan', lat: 36.2048, lng: 138.2529 },
    { country: 'UK', lat: 55.3781, lng: -3.436 },
    { country: 'France', lat: 46.2276, lng: 2.2137 },
    { country: 'Australia', lat: -25.2744, lng: 133.7751 },
  ];

  return Array.from({ length: count }, (_, i) => {
    const loc = locationCoords[i % locationCoords.length];
    return {
      ip: generateRandomIP(),
      lat: loc.lat + (Math.random() - 0.5) * 10,
      lng: loc.lng + (Math.random() - 0.5) * 10,
      country: loc.country,
      severity: severities[Math.floor(Math.random() * severities.length)],
    };
  });
};

export const mockUser = {
  id: 'user-001',
  name: 'Admin User',
  email: 'admin@synapsesentinel.io',
  role: 'Security Administrator',
};
