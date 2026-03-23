import React from 'react';
import { ControlVariables } from '@/src/hooks/useSimulation';
import { cn } from '@/src/lib/utils';
import { Zap, Shield, Scale, Cpu } from 'lucide-react';

interface ControlPanelProps {
  controls: ControlVariables;
  setControls: React.Dispatch<React.SetStateAction<ControlVariables>>;
  isAutoOptimizing: boolean;
  onToggleAuto: () => void;
}

export function ControlPanel({
  controls,
  setControls,
  isAutoOptimizing,
  onToggleAuto,
}: ControlPanelProps) {
  const handleChange = (key: keyof ControlVariables, value: number) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          ASI Control Levers u(t)
        </h2>
        <button
          onClick={onToggleAuto}
          className={cn(
            "px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all",
            isAutoOptimizing 
              ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
          )}
        >
          {isAutoOptimizing ? "Auto-Optimization Active" : "Manual Override"}
        </button>
      </div>

      <div className="space-y-8">
        <ControlSlider
          icon={<Zap className="w-3 h-3" />}
          label="Economic Incentives"
          value={controls.economicIncentives}
          onChange={(v) => handleChange('economicIncentives', v)}
          disabled={isAutoOptimizing}
          color="text-emerald-500"
        />
        <ControlSlider
          icon={<Shield className="w-3 h-3" />}
          label="Supply Distribution"
          value={controls.supplyDistribution}
          onChange={(v) => handleChange('supplyDistribution', v)}
          disabled={isAutoOptimizing}
          color="text-blue-500"
        />
        <ControlSlider
          icon={<Scale className="w-3 h-3" />}
          label="Legal Strictures"
          value={controls.legalStrictures}
          onChange={(v) => handleChange('legalStrictures', v)}
          disabled={isAutoOptimizing}
          color="text-amber-500"
        />
      </div>

      <div className="mt-auto pt-6 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isAutoOptimizing ? "bg-amber-500" : "bg-emerald-500")}></div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            System Status: {isAutoOptimizing ? "Autonomous" : "Operator-Led"}
          </span>
        </div>
        <p className="text-[9px] font-mono text-zinc-700 leading-tight">
          ASI optimizing policy u* to minimize macrosocial friction and system entropy.
        </p>
      </div>
    </div>
  );
}

interface ControlSliderProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  color: string;
}

function ControlSlider({ icon, label, value, onChange, disabled, color }: ControlSliderProps) {
  return (
    <div className={cn("space-y-3", disabled && "opacity-40 grayscale")}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-100">{(value * 100).toFixed(0)}%</span>
      </div>
      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-zinc-100"
      />
      <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  );
}
