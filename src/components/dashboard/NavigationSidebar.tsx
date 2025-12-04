import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FilterState, AttackType, Severity } from '@/types/security';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  User, 
  Filter, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  FileDown,
  RotateCcw,
  Play,
  AlertTriangle,
  Zap,
  Bug,
  Wifi,
  CheckCircle,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavigationSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  simulationMode: boolean;
  onSimulationToggle: () => void;
}

const attackTypes: { value: AttackType; label: string; icon: typeof AlertTriangle }[] = [
  { value: 'Possible DDoS', label: 'Possible DDoS', icon: Zap },
  { value: 'Suspicious Host', label: 'Suspicious Host', icon: Bug },
  { value: 'AI Flagged Anomaly', label: 'AI Flagged', icon: AlertTriangle },
  { value: 'High Risk IP', label: 'High Risk IP', icon: Wifi },
  { value: 'Normal', label: 'Normal', icon: CheckCircle },
  { value: 'Large Packet', label: 'Large Packet', icon: Package },
];

const severityLevels: { value: Severity; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'bg-severity-critical' },
  { value: 'high', label: 'High', color: 'bg-severity-high' },
  { value: 'medium', label: 'Medium', color: 'bg-severity-medium' },
  { value: 'low', label: 'Low', color: 'bg-severity-low' },
];

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  filters,
  onFiltersChange,
  simulationMode,
  onSimulationToggle,
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleAttackTypeToggle = (type: AttackType) => {
    const newTypes = filters.attackTypes.includes(type)
      ? filters.attackTypes.filter(t => t !== type)
      : [...filters.attackTypes, type];
    onFiltersChange({ ...filters, attackTypes: newTypes });
  };

  const handleSeverityToggle = (severity: Severity) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter(s => s !== severity)
      : [...filters.severities, severity];
    onFiltersChange({ ...filters, severities: newSeverities });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your security report is being generated...",
    });
  };

  const handleResetLogs = () => {
    toast({
      title: "Logs Reset",
      description: "All logs have been cleared.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-foreground">Synapse</h1>
                <p className="text-xs text-muted-foreground">Sentinel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs text-primary">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {/* Filters Section */}
        <Collapsible open={filterOpen && !isCollapsed} onOpenChange={setFilterOpen}>
          <CollapsibleTrigger asChild>
            <button className={cn(
              "nav-item w-full",
              filterOpen && "nav-item-active"
            )}>
              <Filter className="w-5 h-5" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Filters</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    filterOpen && "rotate-90"
                  )} />
                </>
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2 pl-4">
            {/* Attack Types */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Attack Types
              </p>
              <div className="space-y-1">
                {attackTypes.map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={filters.attackTypes.includes(value)}
                      onCheckedChange={() => handleAttackTypeToggle(value)}
                    />
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Severity
              </p>
              <div className="space-y-1">
                {severityLevels.map(({ value, label, color }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={filters.severities.includes(value)}
                      onCheckedChange={() => handleSeverityToggle(value)}
                    />
                    <div className={cn("w-3 h-3 rounded-full", color)} />
                    <span className="text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Settings Section */}
        <Collapsible open={settingsOpen && !isCollapsed} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger asChild>
            <button className={cn(
              "nav-item w-full",
              settingsOpen && "nav-item-active"
            )}>
              <Settings className="w-5 h-5" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Settings</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    settingsOpen && "rotate-90"
                  )} />
                </>
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2 pl-4">
            <button
              onClick={handleExportPDF}
              className="nav-item w-full text-sm"
            >
              <FileDown className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleResetLogs}
              className="nav-item w-full text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Logs</span>
            </button>
            <button
              onClick={onSimulationToggle}
              className={cn(
                "nav-item w-full text-sm",
                simulationMode && "bg-status-warning/10 text-status-warning"
              )}
            >
              <Play className="w-4 h-4" />
              <span>Simulation {simulationMode ? 'On' : 'Off'}</span>
            </button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="nav-item w-full text-status-danger hover:bg-status-danger/10"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default NavigationSidebar;
