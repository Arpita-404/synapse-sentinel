import React from 'react';
import { IPLocation, Severity } from '@/types/security';
import { cn } from '@/lib/utils';

interface WorldMapProps {
  locations: IPLocation[];
}

const severityColors: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  normal: '#94a3b8',
};

// Convert lat/lng to SVG coordinates (simple equirectangular projection)
const latLngToPoint = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

const WorldMap: React.FC<WorldMapProps> = ({ locations }) => {
  const width = 800;
  const height = 400;

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Geographical Map</h3>
          <p className="text-sm text-muted-foreground mt-1">IP source locations worldwide</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {(['critical', 'high', 'medium', 'low', 'normal'] as Severity[]).map((sev) => (
            <div key={sev} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: severityColors[sev] }}
              />
              <span className="text-muted-foreground capitalize">{sev}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative bg-muted/30 rounded-lg overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        >
          {/* World Map Background - Simplified continents */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(220, 13%, 88%)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          
          <rect width={width} height={height} fill="url(#grid)" />
          
          {/* Simplified continent outlines */}
          <g fill="hsl(220, 14%, 92%)" stroke="hsl(220, 13%, 85%)" strokeWidth="1">
            {/* North America */}
            <path d="M80,80 Q120,60 180,70 L200,100 Q220,130 200,160 L160,180 Q120,190 100,170 L80,140 Q60,110 80,80" />
            {/* South America */}
            <path d="M160,200 Q180,190 200,200 L210,250 Q200,300 180,320 L160,310 Q140,280 150,240 Z" />
            {/* Europe */}
            <path d="M380,70 Q420,60 450,80 L460,110 Q440,130 400,120 L380,100 Z" />
            {/* Africa */}
            <path d="M380,140 Q420,130 450,150 L460,220 Q440,280 400,290 L370,260 Q360,200 380,140" />
            {/* Asia */}
            <path d="M480,60 Q560,50 640,70 L680,120 Q700,160 680,200 L600,220 Q520,200 500,160 L480,100 Z" />
            {/* Australia */}
            <path d="M620,260 Q660,250 700,270 L710,310 Q690,340 650,330 L620,300 Z" />
          </g>

          {/* Connection lines */}
          <g stroke="hsl(220, 60%, 50%)" strokeWidth="0.5" opacity="0.3">
            {locations.slice(0, 5).map((loc, i) => {
              const point = latLngToPoint(loc.lat, loc.lng, width, height);
              const centerX = width / 2;
              const centerY = height / 2;
              return (
                <line
                  key={`line-${i}`}
                  x1={centerX}
                  y1={centerY}
                  x2={point.x}
                  y2={point.y}
                  strokeDasharray="5,5"
                />
              );
            })}
          </g>

          {/* Location markers */}
          {locations.map((loc, index) => {
            const point = latLngToPoint(loc.lat, loc.lng, width, height);
            const color = severityColors[loc.severity];
            
            return (
              <g key={`marker-${index}`} transform={`translate(${point.x}, ${point.y})`}>
                {/* Ping animation circle */}
                <circle
                  r="12"
                  fill={color}
                  opacity="0.3"
                  className="animate-map-ping"
                  style={{ transformOrigin: 'center', animationDelay: `${index * 0.2}s` }}
                />
                {/* Main marker */}
                <circle
                  r="6"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Tooltip */}
                <title>{`${loc.ip}\n${loc.country}\nSeverity: ${loc.severity}`}</title>
              </g>
            );
          })}

          {/* Center indicator */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r="4"
            fill="hsl(220, 60%, 50%)"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        {/* Location list overlay */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50 max-h-32 overflow-y-auto scrollbar-thin">
          <p className="text-xs font-semibold text-foreground mb-2">Active Locations ({locations.length})</p>
          <div className="space-y-1">
            {locations.slice(0, 5).map((loc, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: severityColors[loc.severity] }}
                />
                <span className="text-muted-foreground">{loc.country}</span>
                <span className="font-mono text-foreground">{loc.ip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
