import React from 'react';
import { Alert, Severity } from '@/types/security';
import { AlertTriangle, CheckCircle, XCircle, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RealTimeAlertsProps {
  alerts: Alert[];
}

const severityIcons: Record<Severity, typeof AlertTriangle> = {
  critical: XCircle,
  high: AlertTriangle,
  medium: AlertTriangle,
  low: CheckCircle,
  normal: CheckCircle,
};

const severityColors: Record<Severity, string> = {
  critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  high: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  low: 'text-severity-low bg-severity-low/10 border-severity-low/30',
  normal: 'text-severity-normal bg-severity-normal/10 border-severity-normal/30',
};

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ alerts }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Real-time Alerts</h3>
            <p className="text-sm text-muted-foreground mt-1">AI & Blockchain verified</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-status-danger"></span>
            </span>
            <span className="text-xs text-muted-foreground ml-2">Live</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = severityIcons[alert.severity];
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border animate-fade-in",
                  severityColors[alert.severity]
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{alert.attackType}</span>
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-sm opacity-90 mb-2">
                      IP: <span className="font-mono font-medium">{alert.sourceIP}</span>
                    </p>

                    <div className="flex items-center gap-3 text-xs">
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full",
                        alert.aiPrediction === 'malicious' 
                          ? 'bg-red-500/20 text-red-700' 
                          : 'bg-green-500/20 text-green-700'
                      )}>
                        <span className="font-medium">AI:</span>
                        <span>{alert.aiPrediction === 'malicious' ? 'Malicious' : 'Safe'}</span>
                      </div>
                      
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full",
                        alert.blockchainVerified 
                          ? 'bg-blue-500/20 text-blue-700' 
                          : 'bg-orange-500/20 text-orange-700'
                      )}>
                        <Shield className="h-3 w-3" />
                        <span>{alert.blockchainVerified ? 'Verified' : 'Pending'}</span>
                      </div>
                    </div>

                    <p className="text-xs opacity-75 mt-2 line-clamp-2">
                      {alert.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RealTimeAlerts;
