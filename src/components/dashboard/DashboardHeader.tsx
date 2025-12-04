import React from 'react';
import { Shield, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  simulationMode: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ simulationMode }) => {
  return (
    <header className="h-16 bg-card border-b border-border/50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-heading font-bold text-foreground">
            Synapse Sentinel
          </h1>
        </div>
        {simulationMode && (
          <span className="px-3 py-1 text-xs font-medium bg-status-warning/10 text-status-warning rounded-full animate-pulse">
            Simulation Mode
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs, IPs..."
            className="pl-10 h-9 bg-background border-border/50"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-status-danger rounded-full" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
