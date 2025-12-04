import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/5 border-primary/20',
  warning: 'bg-status-warning/5 border-status-warning/20',
  danger: 'bg-status-danger/5 border-status-danger/20',
  success: 'bg-status-online/5 border-status-online/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  warning: 'bg-status-warning/10 text-status-warning',
  danger: 'bg-status-danger/10 text-status-danger',
  success: 'bg-status-online/10 text-status-online',
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default' 
}) => {
  return (
    <div className={cn(
      "stat-card flex items-start justify-between",
      variantStyles[variant]
    )}>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className={cn(
            "inline-flex items-center text-xs font-medium",
            trend.isPositive ? "text-status-online" : "text-status-danger"
          )}>
            <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            <span className="ml-1 text-muted-foreground">vs last hour</span>
          </div>
        )}
      </div>
      <div className={cn(
        "p-3 rounded-xl",
        iconStyles[variant]
      )}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default StatCard;
