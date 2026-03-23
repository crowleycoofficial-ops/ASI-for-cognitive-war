import React, { useEffect, useState, useRef } from 'react';
import { SystemState } from '@/src/hooks/useSimulation';
import { cn } from '@/src/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'action';
}

export function SystemLog({ state }: { state: SystemState }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newLogs: LogEntry[] = [];
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (state.entropy > 30) {
      newLogs.push({
        id: Math.random().toString(36),
        timestamp,
        message: `CRITICAL: System entropy threshold exceeded (${state.entropy.toFixed(2)}). Initiating friction reduction protocols.`,
        type: 'critical'
      });
    }

    if (state.dag > 0.4) {
      newLogs.push({
        id: Math.random().toString(36),
        timestamp,
        message: `WARNING: High epistemic contamination (DAG: ${state.dag.toFixed(2)}). Reflexive loop instability detected.`,
        type: 'warning'
      });
    }

    if (state.time % 5 < 0.1) {
       newLogs.push({
        id: Math.random().toString(36),
        timestamp,
        message: `ASI: Re-calculating optimal policy u* for time t=${state.time.toFixed(1)}.`,
        type: 'action'
      });
    }

    if (newLogs.length > 0) {
      setLogs(prev => [...prev, ...newLogs].slice(-50));
    }
  }, [state.entropy > 30, state.dag > 0.4, Math.floor(state.time / 5)]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col h-full">
      <div className="p-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">System Event Log</h2>
        <span className="text-[9px] font-mono text-zinc-700 uppercase">Live Feed</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] scrollbar-hide"
      >
        {logs.length === 0 && (
          <div className="text-zinc-800 italic">Awaiting system telemetry...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-1 duration-300">
            <span className="text-zinc-700 shrink-0">[{log.timestamp}]</span>
            <span className={cn(
              "break-words",
              log.type === 'critical' && "text-red-500 font-bold",
              log.type === 'warning' && "text-amber-500",
              log.type === 'action' && "text-blue-400",
              log.type === 'info' && "text-zinc-400"
            )}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
