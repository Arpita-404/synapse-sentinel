import React from 'react';
import { NetworkLog, Severity, AttackType } from '@/types/security';
import { Button } from '@/components/ui/button';
import { Eye, Lock, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecuredLogsTableProps {
  logs: NetworkLog[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onInspect: (log: NetworkLog) => void;
  onDecrypt: (log: NetworkLog) => void;
  onBlock: (log: NetworkLog) => void;
}

const severityColors: Record<Severity, string> = {
  critical: 'bg-severity-critical/10 text-severity-critical border-severity-critical/30',
  high: 'bg-severity-high/10 text-severity-high border-severity-high/30',
  medium: 'bg-severity-medium/10 text-severity-medium border-severity-medium/30',
  low: 'bg-severity-low/10 text-severity-low border-severity-low/30',
  normal: 'bg-severity-normal/10 text-severity-normal border-severity-normal/30',
};

const attackTypeColors: Record<AttackType, string> = {
  'Possible DDoS': 'bg-red-500/10 text-red-600',
  'Suspicious Host': 'bg-orange-500/10 text-orange-600',
  'AI Flagged Anomaly': 'bg-purple-500/10 text-purple-600',
  'High Risk IP': 'bg-red-500/10 text-red-600',
  'Normal': 'bg-green-500/10 text-green-600',
  'Large Packet': 'bg-yellow-500/10 text-yellow-600',
};

const SecuredLogsTable: React.FC<SecuredLogsTableProps> = ({
  logs,
  currentPage,
  totalPages,
  onPageChange,
  onInspect,
  onDecrypt,
  onBlock,
}) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-lg font-heading font-semibold text-foreground">Secured Logs</h3>
        <p className="text-sm text-muted-foreground mt-1">Blockchain-verified network traffic records</p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source IP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dest IP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protocol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Size</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Browser</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Country</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Abuse</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Host</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Server</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requests</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {logs.map((log) => (
              <tr 
                key={log.id} 
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-foreground font-mono whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground font-mono">{log.sourceIP}</td>
                <td className="px-4 py-3 text-sm text-foreground font-mono">{log.destinationIP}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {log.protocol}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatBytes(log.packetSize)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{log.browser}</td>
                <td className="px-4 py-3 text-sm text-foreground">{log.country}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded",
                    log.abuseScore > 70 ? 'bg-red-500/10 text-red-600' :
                    log.abuseScore > 40 ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-green-500/10 text-green-600'
                  )}>
                    {log.abuseScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded border capitalize",
                    severityColors[log.severity]
                  )}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded whitespace-nowrap",
                    attackTypeColors[log.attackType]
                  )}>
                    {log.attackType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[150px]" title={log.hostName}>
                  {log.hostName}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{log.serverLocation}</td>
                <td className="px-4 py-3 text-sm text-foreground font-medium">{log.requestCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => onInspect(log)}
                      title="Inspect"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-status-info hover:bg-status-info/10"
                      onClick={() => onDecrypt(log)}
                      title="Decrypt"
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-status-danger hover:bg-status-danger/10"
                      onClick={() => onBlock(log)}
                      title="Block"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuredLogsTable;
