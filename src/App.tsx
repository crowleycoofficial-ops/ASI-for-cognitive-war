/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { useOperationalData } from './hooks/useOperationalData';
import { MetricCard } from './components/MetricCard';
import { ControlPanel } from './components/ControlPanel';
import { SystemLog } from './components/SystemLog';
import { cn } from './lib/utils';
import { 
  Activity, 
  Brain, 
  Database, 
  Globe, 
  Zap, 
  ShieldAlert, 
  Cpu,
  BarChart3,
  Radio,
  Loader2,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const { 
    state, 
    controls, 
    setControls, 
    history, 
    isAutoOptimizing, 
    toggleAutoOptimization,
    securitiesActive,
    toggleSecurities
  } = useSimulation();

  const {
    isOperational,
    setIsOperational,
    realTelemetry,
    isLoading,
    metrics: realMetrics
  } = useOperationalData();

  // Use real metrics if operational mode is on
  const displayRI = isOperational ? realMetrics.ri : state.ri;
  const displayGS = isOperational ? realMetrics.gs : state.gs;
  const displayDAG = isOperational ? realMetrics.dag : state.dag;

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 font-sans selection:bg-amber-500/30 selection:text-amber-200",
      securitiesActive ? "bg-[#050505]" : "bg-[#0a0505]"
    )}>
      {/* Top Header / Kardashev Status */}
      <header className={cn(
        "border-b transition-colors duration-500 sticky top-0 z-50",
        securitiesActive ? "border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md" : "border-red-900/50 bg-red-950/20 backdrop-blur-md"
      )}>
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-8 h-8 border rounded flex items-center justify-center transition-colors",
              securitiesActive ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/40 animate-pulse"
            )}>
              <Cpu className={cn("w-4 h-4 transition-colors", securitiesActive ? "text-amber-500" : "text-red-500")} />
            </div>
            <div>
              <h1 className={cn(
                "text-xs font-mono font-bold uppercase tracking-[0.3em] transition-colors",
                securitiesActive ? "text-zinc-100" : "text-red-500"
              )}>
                ASI Macrosocial Controller
              </h1>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                {securitiesActive ? "Stochastic Control Framework v2.9" : "UNRESTRICTED ACCESS MODE // PROTOCOLS BYPASSED"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOperational(!isOperational)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded border text-[10px] font-mono font-bold uppercase tracking-widest transition-all",
                isOperational 
                  ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Radio className={cn("w-3 h-3", isOperational && "animate-pulse")} />
              {isOperational ? "Operational Mode: Live" : "Switch to Operational Mode"}
            </button>

            <div className="hidden md:flex flex-col items-end gap-1 ml-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Kardashev Scale</span>
                <span className={cn("text-xs font-mono font-bold", securitiesActive ? "text-amber-500" : "text-red-500")}>
                  Type {state.kardashevScale.toFixed(4)}
                </span>
              </div>
              <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                    securitiesActive ? "bg-amber-500" : "bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
                  )}
                  style={{ width: `${(state.kardashevScale / 1) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 border rounded transition-all",
              securitiesActive 
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                : "bg-red-500/10 border-red-500/40 text-red-500 animate-bounce"
            )}>
              <Activity className="w-3 h-3 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                {securitiesActive ? "System Stable" : "CRITICAL INSTABILITY"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Primary Metrics */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section: Macrosocial State S(t) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-zinc-500" />
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Macrosocial State S(t)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard
                label="Metabolic Flow"
                value={state.metabolicFlow}
                unit="%"
                data={history}
                dataKey="metabolicFlow"
                color={securitiesActive ? "#3b82f6" : "#ef4444"}
                description="Efficiency of resource distribution and metabolic conversion across the social body."
              />
              <MetricCard
                label="Mass Behavior"
                value={state.massBehavior}
                unit="index"
                data={history}
                dataKey="massBehavior"
                color={securitiesActive ? "#10b981" : "#ef4444"}
                description="Aggregate social stability and behavioral cohesion within the population."
              />
              <MetricCard
                label="Thermal Efficiency"
                value={state.thermalEfficiency}
                unit="%"
                data={history}
                dataKey="thermalEfficiency"
                color={securitiesActive ? "#8b5cf6" : "#ef4444"}
                description="Infrastructure health and energy dissipation efficiency."
              />
              <MetricCard
                label="System Entropy"
                value={state.entropy}
                unit="ΔS"
                data={history}
                dataKey="entropy"
                color={state.entropy > 25 || !securitiesActive ? "#ef4444" : "#f59e0b"}
                description="Measure of system disorder and macrosocial friction."
              />
            </div>
          </section>

          {/* Section: Cognitive War Framework (HWE) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-zinc-500" />
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Cognitive War Metrics (HWE)</h2>
              </div>
              {isOperational && (
                <div className="flex items-center gap-2 text-[9px] font-mono text-blue-400 uppercase animate-pulse">
                  <Activity className="w-3 h-3" />
                  Live Telemetry Active
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                label="Reflexivity Index (RI)"
                value={displayRI}
                data={history}
                dataKey="ri"
                color="#f43f5e"
                description="Proportion of content traceable to AI-amplified sources."
              />
              <MetricCard
                label="Grounding Score (GS)"
                value={displayGS}
                data={history}
                dataKey="gs"
                color="#06b6d4"
                description="Proportion of assessment traceable to independent physical sensors."
              />
              <MetricCard
                label="Disinfo Index (DAG)"
                value={displayDAG}
                data={history}
                dataKey="dag"
                color="#ec4899"
                description="Contamination level of the information environment."
              />
            </div>
          </section>

          {/* Operational Telemetry Feed */}
          {isOperational && (
            <section className="bg-[#0a0a0a] border border-blue-900/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-500" />
                  <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Ecosystem Telemetry Feed</h2>
                </div>
                {isLoading && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
              </div>
              
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {realTelemetry.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-zinc-700 font-mono text-xs italic">
                    Awaiting GDELT telemetry stream...
                  </div>
                )}
                {realTelemetry.map((article, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded flex items-center justify-between group hover:border-blue-500/30 transition-all">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold",
                          article.classification === 1 ? "bg-emerald-500/10 text-emerald-500" :
                          article.classification === 2 ? "bg-blue-500/10 text-blue-500" :
                          "bg-red-500/10 text-red-500"
                        )}>
                          Class {article.classification}
                        </span>
                        {article.isAI && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 uppercase font-bold">
                            AI Detected
                          </span>
                        )}
                      </div>
                      <h3 className="text-[11px] font-medium text-zinc-300 line-clamp-1">{article.title}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter text-right">Confidence</p>
                        <p className="text-[10px] font-mono text-zinc-400">{(article.score * 100).toFixed(0)}%</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-blue-400 transition-colors cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Large Visualization Area */}
          <section className={cn(
            "bg-[#0a0a0a] border p-6 h-[400px] relative transition-colors duration-500",
            securitiesActive ? "border-[#1a1a1a]" : "border-red-900/50 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]"
          )}>
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-zinc-500" />
                  <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Multidimensional Phase Space</h2>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", securitiesActive ? "bg-blue-500" : "bg-red-500")}></div>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Metabolic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", securitiesActive ? "bg-emerald-500" : "bg-red-500")}></div>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", securitiesActive ? "bg-amber-500" : "bg-red-500")}></div>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Entropy</span>
                  </div>
                </div>
             </div>
             
             {/* Placeholder for a more complex D3 or custom SVG visualization */}
             <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className={cn(
                  "w-[80%] h-[80%] border border-dashed rounded-full animate-[spin_20s_linear_infinite]",
                  securitiesActive ? "border-zinc-800" : "border-red-900"
                )}></div>
                <div className={cn(
                  "absolute w-[60%] h-[60%] border border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]",
                  securitiesActive ? "border-zinc-800" : "border-red-900"
                )}></div>
                <div className={cn(
                  "absolute w-[40%] h-[40%] border border-dashed rounded-full animate-[spin_10s_linear_infinite]",
                  securitiesActive ? "border-zinc-800" : "border-red-900"
                )}></div>
             </div>

             <div className="relative z-10 h-full flex items-end pb-12">
                <div className="w-full h-48 flex items-end gap-1">
                  {history.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-px">
                      <div 
                        className={cn(
                          "w-full transition-colors",
                          securitiesActive ? "bg-blue-500/40 hover:bg-blue-500" : "bg-red-500/40 hover:bg-red-500"
                        )} 
                        style={{ height: `${h.metabolicFlow}%` }}
                      ></div>
                      <div 
                        className={cn(
                          "w-full transition-colors",
                          securitiesActive ? "bg-emerald-500/40 hover:bg-emerald-500" : "bg-red-600/40 hover:bg-red-600"
                        )} 
                        style={{ height: `${h.massBehavior}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Controls & Logs */}
        <div className="lg:col-span-4 space-y-6">
          <ControlPanel 
            controls={controls}
            setControls={setControls}
            isAutoOptimizing={isAutoOptimizing}
            onToggleAuto={toggleAutoOptimization}
          />
          
          <div className="h-[400px]">
            <SystemLog state={state} />
          </div>

          <div className={cn(
            "border p-6 space-y-4 transition-colors duration-500",
            securitiesActive ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-red-950/20 border-red-900/50"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className={cn("w-4 h-4", securitiesActive ? "text-amber-500" : "text-red-500")} />
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">Security Protocols</h2>
              </div>
              <button 
                onClick={toggleSecurities}
                className={cn(
                  "px-2 py-0.5 text-[8px] font-mono border uppercase tracking-widest transition-all",
                  securitiesActive ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                )}
              >
                {securitiesActive ? "Vire les sécurités" : "Rétablir les sécurités"}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-zinc-900/50 border border-zinc-800 rounded">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">TDC Oracle</span>
                <span className={cn("text-[10px] font-mono font-bold", securitiesActive ? "text-emerald-500" : "text-red-600 animate-pulse")}>
                  {securitiesActive ? "ACTIVE" : "BYPASSED"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-zinc-900/50 border border-zinc-800 rounded">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Quantum Auth</span>
                <span className={cn("text-[10px] font-mono font-bold", securitiesActive ? "text-emerald-500" : "text-red-600")}>
                  {securitiesActive ? "SECURE" : "DISABLED"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-zinc-900/50 border border-zinc-800 rounded">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Reflexive Shield</span>
                <span className={cn("text-[10px] font-mono font-bold", securitiesActive ? "text-amber-500" : "text-red-600")}>
                  {securitiesActive ? "STANDBY" : "OFFLINE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-[#1a1a1a] bg-[#080808] p-4 mt-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Uplink: Established</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-zinc-600" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Telemetry: 1.2 GB/s</span>
            </div>
          </div>
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
            © 2026 Lux Ferox Independent Research • ASI-Driven Stochastic Control Framework
          </p>
        </div>
      </footer>
    </div>
  );
}
