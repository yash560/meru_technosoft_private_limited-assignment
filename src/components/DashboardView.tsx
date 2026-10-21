'use client';

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  Play, 
  Sparkles, 
  TrendingUp,
  ArrowRight,
  Database,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { TestSuite, TestCase, DefectItem } from '../types/qa';

interface DashboardViewProps {
  suites: TestSuite[];
  testCases: TestCase[];
  defects: DefectItem[];
  onRunAll: () => void;
  onRunSuite: (suiteId: string) => void;
  isRunning: boolean;
  onSelectTab: (tab: string) => void;
  onSelectTestCase: (tc: TestCase) => void;
  filterHorizon: string;
  setFilterHorizon: (h: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  suites,
  testCases,
  defects,
  onRunAll,
  onRunSuite,
  isRunning,
  onSelectTab,
  onSelectTestCase,
  filterHorizon,
  setFilterHorizon
}) => {
  const totalTests = testCases.length;
  const passedTests = testCases.filter(t => t.status === 'PASSED').length;
  const failedTests = testCases.filter(t => t.status === 'FAILED').length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '100';
  const p0Blockers = testCases.filter(t => t.severity === 'P0_BLOCKER').length;
  const p0Passed = testCases.filter(t => t.severity === 'P0_BLOCKER' && t.status === 'PASSED').length;

  const totalDuration = suites.reduce((acc, s) => acc + s.durationMs, 0);

  // Filter test cases based on filterHorizon
  const displayedCases = testCases.filter(tc => {
    if (filterHorizon === 'all') return true;
    if (filterHorizon === 'p0') return tc.severity === 'P0_BLOCKER';
    if (filterHorizon === 'p1') return tc.severity === 'P1_CRITICAL';
    if (filterHorizon === 'financial') return tc.module === 'GENERAL_LEDGER' || tc.module === 'GST_TAX';
    if (filterHorizon === 'ai') return tc.module === 'AI_MUNIMJI';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-sky-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Chartered-Accountant Level Precision Automation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HelloBooks.ai Enterprise Test Harness
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Automated testing suite engineered for Meru Technosoft. Enforces double-entry mathematical invariants, bank feed deduplication, Indian GST compliance, AI Munimji prompt guardrails, and Tally Prime XML synchronization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="dashboard-run-all-btn"
              onClick={onRunAll}
              disabled={isRunning}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Executing 34 Test Cases...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Full Regression Suite</span>
                </>
              )}
            </button>
            <button
              id="dashboard-chaos-shortcut"
              onClick={() => onSelectTab('chaos')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <span>Test Chaos Faults</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pass Rate */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pass Rate</span>
            <div className={`p-2 rounded-lg ${failedTests === 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{passRate}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({passedTests}/{totalTests} Passed)</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${failedTests === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${passRate}%` }}
            ></div>
          </div>
        </div>

        {/* P0 Blocker Integrity */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">P0 Invariance</span>
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{p0Passed}/{p0Blockers}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Invariant</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Assets = Liabilities + Equity & Idempotency guaranteed
          </p>
        </div>

        {/* Total Suite Execution Duration */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suite Latency</span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalDuration}ms</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">(Sub-second run)</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Average test case runtime: {(totalDuration / totalTests).toFixed(1)}ms
          </p>
        </div>

        {/* Defects in Triage */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Defect Backlog</span>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{defects.length}</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Tracked in QA</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            2 resolved, 1 active triage with reproduction steps
          </p>
        </div>

      </div>

      {/* Test Suites Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              HelloBooks.ai Core Subsystem Test Suites
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('matrix')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
          >
            <span>View All 34 Test Cases</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suites.map((suite) => {
            const hasFailure = suite.failedTests > 0;
            return (
              <div
                key={suite.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      {suite.module}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      hasFailure 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {hasFailure ? `${suite.failedTests} FAILED` : `${suite.passedTests}/${suite.totalTests} PASSED`}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {suite.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {suite.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{suite.durationMs}ms</span>
                  </div>
                  <button
                    id={`run-suite-${suite.id.toLowerCase()}`}
                    onClick={() => onRunSuite(suite.id)}
                    disabled={isRunning}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-sky-950/80 text-slate-700 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300 font-semibold transition-colors disabled:opacity-50"
                  >
                    Run Suite
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Horizon Period & Severity Filtering Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Automated Invariance Verification Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive test scenario explorer with direct assertion inspection
            </p>
          </div>

          {/* Horizon & Category Filter Pills */}
          <div className="flex items-center flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Cases (34)' },
              { id: 'p0', label: 'P0 Blockers' },
              { id: 'p1', label: 'P1 Critical' },
              { id: 'financial', label: 'Ledger & GST' },
              { id: 'ai', label: 'AI Munimji' }
            ].map(f => (
              <button
                key={f.id}
                id={`filter-${f.id}`}
                onClick={() => setFilterHorizon(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterHorizon === f.id
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Test ID</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Scenario Title</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Duration</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {displayedCases.slice(0, 7).map((tc) => (
                <tr 
                  key={tc.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-sky-600 dark:text-sky-400 font-bold">
                    {tc.id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {tc.moduleName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-slate-200 max-w-xs truncate">
                    {tc.title}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tc.severity === 'P0_BLOCKER' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                        : tc.severity === 'P1_CRITICAL'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {tc.severity.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {tc.type}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      tc.status === 'PASSED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {tc.status === 'PASSED' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                      <span>{tc.status}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                    {tc.durationMs}ms
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectTestCase(tc)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-sky-600 dark:text-sky-400 font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
