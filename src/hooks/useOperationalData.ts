import { useState, useEffect, useCallback } from 'react';
import { analyzeNewsBatch, NewsAnalysis } from '../services/geminiService';

export function useOperationalData() {
  const [isOperational, setIsOperational] = useState(false);
  const [realTelemetry, setRealTelemetry] = useState<NewsAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    ri: 0,
    gs: 0,
    dag: 0,
  });

  const fetchAndAnalyze = useCallback(async () => {
    if (!isOperational) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/telemetry/gdelt');
      const data = await response.json();
      
      if (data.articles) {
        const analysis = await analyzeNewsBatch(data.articles);
        setRealTelemetry(analysis);
        
        // Calculate HWE metrics based on real analysis
        // RI = proportion of AI content
        // GS = proportion of factual content (class 1)
        // DAG = proportion of classes 3, 4, 5
        
        const total = analysis.length;
        if (total > 0) {
          const aiCount = analysis.filter(a => a.isAI).length;
          const factualCount = analysis.filter(a => a.classification === 1).length;
          const disinfoCount = analysis.filter(a => a.classification >= 3).length;
          
          setMetrics({
            ri: aiCount / total,
            gs: factualCount / total,
            dag: disinfoCount / total,
          });
        }
      }
    } catch (error) {
      console.error("Operational Telemetry Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isOperational]);

  useEffect(() => {
    if (isOperational) {
      fetchAndAnalyze();
      const interval = setInterval(fetchAndAnalyze, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [isOperational, fetchAndAnalyze]);

  return {
    isOperational,
    setIsOperational,
    realTelemetry,
    isLoading,
    metrics,
  };
}
