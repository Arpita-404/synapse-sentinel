import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AnomalyData } from '@/types/security';

interface AnomalyPieChartProps {
  data: AnomalyData;
}

const COLORS = {
  high: 'hsl(0, 84%, 60%)',
  medium: 'hsl(45, 93%, 47%)',
  low: 'hsl(142, 71%, 45%)',
  normal: 'hsl(220, 14%, 70%)',
};

const AnomalyPieChart: React.FC<AnomalyPieChartProps> = ({ data }) => {
  const chartData = [
    { name: 'High', value: data.high, color: COLORS.high },
    { name: 'Medium', value: data.medium, color: COLORS.medium },
    { name: 'Low', value: data.low, color: COLORS.low },
    { name: 'Normal', value: data.normal, color: COLORS.normal },
  ];

  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  const CustomLegend = () => (
    <div className="space-y-2 mt-4">
      {chartData.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{entry.value}</span>
            <span className="text-muted-foreground text-xs">
              ({((entry.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Detected Anomalies</h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time classification</p>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 13%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [value, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-3xl font-heading font-bold text-foreground">{total}</p>
        <p className="text-sm text-muted-foreground">Total Detected</p>
      </div>

      <CustomLegend />
    </div>
  );
};

export default AnomalyPieChart;
