import { useState, useEffect, useCallback, useRef } from 'react';

export interface SystemState {
  metabolicFlow: number;
  massBehavior: number;
  thermalEfficiency: number;
  entropy: number;
  kardashevScale: number;
  ri: number; // Reflexivity Index
  gs: number; // Grounding Score
  dag: number; // Disinformation Index
  time: number;
}

export interface ControlVariables {
  economicIncentives: number;
  supplyDistribution: number;
  legalStrictures: number;
}

export function useSimulation() {
  const [state, setState] = useState<SystemState>({
    metabolicFlow: 72.4,
    massBehavior: 65.1,
    thermalEfficiency: 81.2,
    entropy: 14.5,
    kardashevScale: 0.72,
    ri: 0.35,
    gs: 0.75,
    dag: 0.22,
    time: 0,
  });

  const [controls, setControls] = useState<ControlVariables>({
    economicIncentives: 0.1,
    supplyDistribution: 0.05,
    legalStrictures: -0.1,
  });

  const [history, setHistory] = useState<SystemState[]>([]);
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const [securitiesActive, setSecuritiesActive] = useState(false);

  const lastUpdateRef = useRef<number>(0);

  const updateSimulation = useCallback(() => {
    setState((prev) => {
      // Simplified SDE implementation
      // dS = F(S, u)dt + Sigma*dW
      
      const dt = 0.1;
      const volatility = securitiesActive ? 0.2 : 0.8;
      const noise = () => (Math.random() - 0.5) * volatility;

      // Entropy increases naturally, but u(t) can reduce it
      // Without securities, entropy growth is accelerated
      const entropyGrowthBase = securitiesActive ? 0.1 : 0.4;
      const dEntropy = (entropyGrowthBase - (prev.metabolicFlow / 1000) - (controls.legalStrictures * 0.2)) * dt + noise() * 0.5;
      
      // Metabolic flow depends on supply distribution and incentives
      const dMetabolic = (controls.supplyDistribution * 2 + controls.economicIncentives * 1 - prev.entropy * 0.01) * dt + noise();
      
      // Mass behavior depends on incentives and disinformation (DAG)
      const dMass = (controls.economicIncentives * 1.5 - prev.dag * 5 - prev.entropy * 0.05) * dt + noise();

      // HWE Metrics dynamics - Spikes when securities are off
      const riGrowth = securitiesActive ? 0.01 : 0.05;
      const dRI = (riGrowth + prev.dag * 0.2 - prev.gs * 0.05) * dt;
      const dDAG = (prev.ri * 0.3 - (securitiesActive ? prev.gs * 0.1 : 0)) * dt;

      const newState = {
        ...prev,
        entropy: Math.max(0, Math.min(100, prev.entropy + dEntropy)),
        metabolicFlow: Math.max(0, Math.min(100, prev.metabolicFlow + dMetabolic)),
        massBehavior: Math.max(0, Math.min(100, prev.massBehavior + dMass)),
        ri: Math.max(0, Math.min(1, prev.ri + dRI)),
        dag: Math.max(0, Math.min(1, prev.dag + dDAG)),
        kardashevScale: prev.kardashevScale + (prev.metabolicFlow > 80 ? 0.0001 : -0.00005),
        time: prev.time + dt,
      };

      return newState;
    });
  }, [controls, securitiesActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSimulation();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateSimulation]);

  useEffect(() => {
    // Keep history for charts
    setHistory((prev) => {
      const newHistory = [...prev, state];
      if (newHistory.length > 50) return newHistory.slice(1);
      return newHistory;
    });
  }, [state]);

  const toggleAutoOptimization = () => setIsAutoOptimizing(!isAutoOptimizing);
  const toggleSecurities = () => setSecuritiesActive(!securitiesActive);

  // Auto-optimization logic (ASI acting)
  useEffect(() => {
    if (!isAutoOptimizing) return;

    const optimize = setInterval(() => {
      setControls((prev) => ({
        economicIncentives: state.massBehavior < 60 ? Math.min(1, prev.economicIncentives + 0.1) : prev.economicIncentives - 0.05,
        supplyDistribution: state.metabolicFlow < 70 ? Math.min(1, prev.supplyDistribution + 0.1) : prev.supplyDistribution - 0.02,
        legalStrictures: state.entropy > 20 ? Math.min(1, prev.legalStrictures + 0.1) : Math.max(-1, prev.legalStrictures - 0.05),
      }));
    }, 2000);

    return () => clearInterval(optimize);
  }, [isAutoOptimizing, state]);

  return {
    state,
    controls,
    setControls,
    history,
    isAutoOptimizing,
    toggleAutoOptimization,
    securitiesActive,
    toggleSecurities,
  };
}
