import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FilterState, NetworkLog, Alert, NetworkTrafficPoint, AnomalyData, IPLocation } from '@/types/security';
import { 
  generateNetworkLogs, 
  generateAlerts, 
  generateNetworkTraffic, 
  generateAnomalyData,
  generateIPLocations 
} from '@/data/mockData';
import NavigationSidebar from '@/components/dashboard/NavigationSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import AnomalyPieChart from '@/components/dashboard/AnomalyPieChart';
import SecuredLogsTable from '@/components/dashboard/SecuredLogsTable';
import RealTimeAlerts from '@/components/dashboard/RealTimeAlerts';
import WorldMap from '@/components/dashboard/WorldMap';
import { Activity, AlertTriangle, Server, Gauge } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LOGS_PER_PAGE = 10;

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // State
  const [filters, setFilters] = useState<FilterState>({
    attackTypes: [],
    severities: [],
  });
  const [simulationMode, setSimulationMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Data state
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trafficData, setTrafficData] = useState<NetworkTrafficPoint[]>([]);
  const [anomalyData, setAnomalyData] = useState<AnomalyData>({ high: 0, medium: 0, low: 0, normal: 0 });
  const [ipLocations, setIPLocations] = useState<IPLocation[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Initialize data
  useEffect(() => {
    setLogs(generateNetworkLogs(100));
    setAlerts(generateAlerts(15));
    setTrafficData(generateNetworkTraffic(30));
    setAnomalyData(generateAnomalyData());
    setIPLocations(generateIPLocations(10));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!simulationMode) return;

    const interval = setInterval(() => {
      // Add new log
      const newLogs = generateNetworkLogs(1);
      setLogs(prev => [...newLogs, ...prev].slice(0, 100));

      // Occasionally add alert
      if (Math.random() > 0.7) {
        const newAlert = generateAlerts(1)[0];
        setAlerts(prev => [newAlert, ...prev].slice(0, 15));
      }

      // Update traffic data
      setTrafficData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          traffic: Math.floor(Math.random() * 800) + 200,
          threats: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0,
        };
        return [...prev.slice(1), newPoint];
      });

      // Update anomaly data occasionally
      if (Math.random() > 0.8) {
        setAnomalyData(generateAnomalyData());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationMode]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesAttackType = filters.attackTypes.length === 0 || 
        filters.attackTypes.includes(log.attackType);
      const matchesSeverity = filters.severities.length === 0 || 
        filters.severities.includes(log.severity);
      return matchesAttackType && matchesSeverity;
    });
  }, [logs, filters]);

  // Paginate logs
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * LOGS_PER_PAGE;
    return filteredLogs.slice(start, start + LOGS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);

  // Stats
  const packetRate = useMemo(() => {
    return trafficData.length > 0 
      ? trafficData[trafficData.length - 1].traffic 
      : 0;
  }, [trafficData]);

  const totalAnomalies = anomalyData.high + anomalyData.medium + anomalyData.low;
  const primaryServer = 'US-East-1';

  // Handlers
  const handleInspect = (log: NetworkLog) => {
    toast({
      title: "Inspecting Log",
      description: `Viewing details for ${log.sourceIP}`,
    });
  };

  const handleDecrypt = (log: NetworkLog) => {
    toast({
      title: "Decrypting Payload",
      description: `Analyzing encrypted data from ${log.sourceIP}`,
    });
  };

  const handleBlock = (log: NetworkLog) => {
    toast({
      title: "IP Blocked",
      description: `${log.sourceIP} has been added to the blocklist`,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <NavigationSidebar
        filters={filters}
        onFiltersChange={setFilters}
        simulationMode={simulationMode}
        onSimulationToggle={() => setSimulationMode(!simulationMode)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader simulationMode={simulationMode} />

        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <StatCard
                title="Packet Rate"
                value={`${packetRate}/min`}
                subtitle="Current throughput"
                icon={Gauge}
                trend={{ value: 12, isPositive: true }}
                variant="primary"
              />
              <StatCard
                title="Anomalies Detected"
                value={totalAnomalies}
                subtitle={`${anomalyData.high} high priority`}
                icon={AlertTriangle}
                trend={{ value: 8, isPositive: false }}
                variant={anomalyData.high > 10 ? 'danger' : 'warning'}
              />
              <StatCard
                title="Active Connections"
                value={filteredLogs.length}
                subtitle="Monitored sessions"
                icon={Activity}
                variant="default"
              />
              <StatCard
                title="Primary Server"
                value={primaryServer}
                subtitle="Active region"
                icon={Server}
                variant="success"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <NetworkGraph data={trafficData} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <AnomalyPieChart data={anomalyData} />
              </div>
            </div>

            {/* Logs and Alerts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <SecuredLogsTable
                  logs={paginatedLogs}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onInspect={handleInspect}
                  onDecrypt={handleDecrypt}
                  onBlock={handleBlock}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <RealTimeAlerts alerts={alerts} />
              </div>
            </div>

            {/* World Map */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <WorldMap locations={ipLocations} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
