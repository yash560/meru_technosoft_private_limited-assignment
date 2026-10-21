'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Gauge, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Server
} from 'lucide-react';
import { PerformanceMetric } from '../types/qa';
import { PERFORMANCE_DATA } from '../data/mockData';

export const PerformanceView: React.FC = () => {
  const [concurrencyLevel, setConcurrencyLevel] = useState<number>(250);

  // Find closest metric point
  const currentMetric = PERFORMANCE_DATA.reduce((prev, curr) => {
    return Math.abs(curr.concurrency - concurrencyLevel) < Math.abs(prev.concurrency - concurrencyLevel)
      ? curr
      : prev;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-600 dark:text-sky-400">
            <Cpu className="w-4 h-4" />
            <span>Load & Stress Concurrency Harness</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            HelloBooks High-Concurrency Stress Benchmark
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Simulates parallel bank statement ingestion, high-frequency journal balance locks, and batch GST filing requests under peak monthly closing loads.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            SLA Standard: &lt;200ms p95 Latency
          </span>
        </div>
      </div>

      {/* Interactive Concurrency Slider Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-500" />
              <span>Simulated Virtual Concurrent Workers (VU)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag slider to benchmark throughput, memory spikes, and latency degradation
            </p>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-mono font-extrabold text-base">
            {concurrencyLevel} Virtual Users
          </div>
        </div>

        <input
          id="concurrency-slider"
          type="range"
          min="10"
          max="1000"
          step="10"
          value={concurrencyLevel}
          onChange={(e) => setConcurrencyLevel(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>10 VU (Baseline)</span>
          <span>100 VU</span>
          <span>250 VU</span>
          <span>500 VU (Peak Closing)</span>
          <span>1,000 VU (Stress Limit)</span>
        </div>
      </div>

      {/* Real-time Dynamic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Throughput */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <span>Throughput</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentMetric.throughputTps.toLocaleString()} <span className="text-xs font-normal text-slate-400">TPS</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transactions / second processed
          </p>
        </div>

        {/* Latency P90 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <span>Latency (p90)</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentMetric.latencyP90} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            ✓ Well within 200ms SLA target
          </p>
        </div>

        {/* Memory Heap */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <span>Node Heap Memory</span>
            <Server className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentMetric.heapMemoryMb} <span className="text-xs font-normal text-slate-400">MB</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Streaming parser prevents OOM
          </p>
        </div>

        {/* Error Rate */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
            <span>Error Rate</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentMetric.errorRatePct}%
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            99.98% clean execution
          </p>
        </div>

      </div>

      {/* Latency Percentile Waterfall Comparison */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-sky-500" />
          <span>Latency Percentile Profile ({concurrencyLevel} Concurrent Workers)</span>
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>p50 Median Response Time</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{currentMetric.latencyP50}ms</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentMetric.latencyP50 / 300) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>p90 Percentile</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{currentMetric.latencyP90}ms</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentMetric.latencyP90 / 300) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span>p99 Tail Latency (Edge Cases)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{currentMetric.latencyP99}ms</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentMetric.latencyP99 / 300) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
