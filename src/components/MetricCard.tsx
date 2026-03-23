import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/src/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  data: any[];
  dataKey: string;
  color?: string;
  className?: string;
  description?: string;
}

export function MetricCard({
  label,
  value,
  unit = '',
  data,
  dataKey,
  color = '#10b981',
  className,
  description,
}: MetricCardProps) {
  return (
    <div className={cn(
      "bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex flex-col gap-2 relative overflow-hidden group transition-all hover:border-[#333]",
      className
    )}>
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-mono font-medium text-zinc-100">
              {typeof value === 'number' ? value.toFixed(2) : value}
            </h3>
            <span className="text-xs font-mono text-zinc-500">{unit}</span>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-[10px] text-zinc-600 font-mono leading-tight z-10">{description}</p>
      )}

      <div className="h-12 w-full mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis hide domain={['auto', 'auto']} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Decorative grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>
    </div>
  );
}
