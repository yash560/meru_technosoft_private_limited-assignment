'use client';

import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Bug, 
  CheckCircle2, 
  XCircle,
  FileCode2,
  Sparkles
} from 'lucide-react';
import { ChaosScenario } from '../types/qa';

interface ChaosEngineViewProps {
  scenarios: ChaosScenario[];
  onToggleScenario: (scenarioId: string) => void;
  onResetChaos: () => void;
  onExecuteChaosRun: () => void;
  isRunning: boolean;
}

export const ChaosEngineView: React.FC<ChaosEngineViewProps> = ({
  scenarios,
  onToggleScenario,
  onResetChaos,
  onExecuteChaosRun,
  isRunning
}) => {
  const activeCount = scenarios.filter(s => s.active).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-sky-500/10 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-sky-950/40 border border-amber-300 dark:border-amber-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
            <span>Chaos Monkey & Synthetic Anomaly Injector</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            HelloBooks Financial Resilience & Fault Injection
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Deliberately inject common real-world accounting bugs (unbalanced debits, Plaid duplicate webhooks, GSTIN checksum errors, prompt injection) to verify that automated QA assertions immediately catch and quarantine them before production persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="chaos-reset-btn"
            onClick={onResetChaos}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Faults</span>
          </button>
          <button
            id="chaos-run-btn"
            onClick={onExecuteChaosRun}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Injecting Faults...' : `Run Fault Verification (${activeCount} Active)`}</span>
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => {
          return (
            <div
              key={scenario.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                scenario.active
                  ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-400 dark:border-amber-700 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {scenario.module}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {scenario.key}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  id={`toggle-chaos-${scenario.key}`}
                  onClick={() => onToggleScenario(scenario.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    scenario.active ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      scenario.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Technical Impact & Assertion Details */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Technical Defense: </span>
                  <span className="text-slate-500 dark:text-slate-400">{scenario.technicalImpact}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{scenario.expectedAssertionFailure}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resilience Architecture Explainer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Double-Entry Zero-Drift Guarantee Architecture</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">1. Pre-Commit Validation</h4>
            <p>Every transaction payload passes through Decimal integer cents validation, preventing floating point penny drifts.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">2. Atomic SQL Transaction Locks</h4>
            <p>Debits and credits are posted in a single database transaction with CHECK (debit_sum == credit_sum) constraints.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">3. Dead-Letter Quarantine</h4>
            <p>Any unbalanced or corrupt payload is rejected with HTTP 422 and routed to a dedicated DLQ table for accountant triage.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
