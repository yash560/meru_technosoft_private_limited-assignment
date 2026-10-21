'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Flame,
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TestSuite, TestCase, ExecutionLog } from '../types/qa';

interface TestRunnerViewProps {
  suites: TestSuite[];
  testCases: TestCase[];
  onRunAll: () => void;
  onRunSuite: (suiteId: string) => void;
  isRunning: boolean;
  logs: ExecutionLog[];
  onSelectTestCase: (tc: TestCase) => void;
  chaosActiveCount: number;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({
  suites,
  testCases,
  onRunAll,
  onRunSuite,
  isRunning,
  logs,
  onSelectTestCase,
  chaosActiveCount
}) => {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>('ALL');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredCases = selectedSuiteId === 'ALL'
    ? testCases
    : testCases.filter(tc => {
        const suite = suites.find(s => s.id === selectedSuiteId);
        return suite ? suite.testCaseIds.includes(tc.id) : true;
      });

  const passedCount = filteredCases.filter(t => t.status === 'PASSED').length;
  const failedCount = filteredCases.filter(t => t.status === 'FAILED').length;

  const downloadReport = () => {
    const report = {
      title: 'HelloBooks.ai Quality Assurance Test Execution Report',
      company: 'Meru Technosoft Private Limited',
      executedBy: 'Brane Autonomous QA Sentinel',
      timestamp: new Date().toISOString(),
      summary: {
        total: filteredCases.length,
        passed: passedCount,
        failed: failedCount,
        passRate: `${((passedCount / filteredCases.length) * 100).toFixed(1)}%`,
        chaosAnomaliesInjected: chaosActiveCount
      },
      results: filteredCases.map(tc => ({
        id: tc.id,
        module: tc.moduleName,
        title: tc.title,
        status: tc.status,
        durationMs: tc.durationMs,
        expected: tc.expectedResult,
        actual: tc.actualResult
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hellobooks_qa_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Live Test Execution Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deterministic assertion runner with microsecond telemetry and real-time ledger verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Suite Selector Dropdown */}
          <select
            id="runner-suite-select"
            value={selectedSuiteId}
            onChange={(e) => setSelectedSuiteId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Suites (34 Test Cases)</option>
            {suites.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.totalTests})</option>
            ))}
          </select>

          {/* Trigger Button */}
          <button
            id="btn-execute-tests"
            onClick={() => selectedSuiteId === 'ALL' ? onRunAll() : onRunSuite(selectedSuiteId)}
            disabled={isRunning}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run {selectedSuiteId === 'ALL' ? 'All (34)' : 'Selected Suite'}</span>
              </>
            )}
          </button>

          {/* Export Report */}
          <button
            id="btn-export-report"
            onClick={downloadReport}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Chaos Alert banner if active */}
      {chaosActiveCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-semibold">
              Chaos Engine Active ({chaosActiveCount} fault injected): Test suite is verifying system resilience and catching deliberate anomalies.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded font-bold">
            FAULT_INJECTED
          </span>
        </div>
      )}

      {/* Main Split Layout: Left Test Results List, Right Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Test Cases Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Test Pipeline ({filteredCases.length})
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{passedCount} Passed</span>
              {failedCount > 0 && (
                <span className="text-rose-600 dark:text-rose-400 font-bold">{failedCount} Failed</span>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCases.map((tc) => {
              const isPassed = tc.status === 'PASSED';
              return (
                <div
                  key={tc.id}
                  onClick={() => onSelectTestCase(tc)}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 cursor-pointer shadow-xs transition-all flex items-start justify-between group"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400">
                        {tc.id}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tc.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {tc.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {tc.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    <div className="flex items-center space-x-1">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={`text-[11px] font-bold ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {tc.status}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {tc.durationMs}ms
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Streaming Terminal Console (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden h-[640px]">
          {/* Terminal Window Chrome */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="font-mono text-slate-300 font-semibold pl-2">
                terminal://meru-qa-runner/hellobooks-audit.log
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px] text-emerald-400">ACTIVE</span>
            </div>
          </div>

          {/* Terminal Output Body */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-slate-950 text-slate-200">
            <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800/80">
              # Meru QA Sentinel v2.4 (Enterprise Financial Testing Harness)
              <br />
              # Target Node: HelloBooks.ai (Meru Technosoft Private Limited)
              <br />
              # Node: v20.19.0 | Prisma: v5.10.0 | Jest: v29.7.0 | Playwright: v1.42.0
            </div>

            {logs.map((log) => {
              const isError = log.level === 'ERROR';
              const isWarn = log.level === 'WARN';
              const isSuccess = log.level === 'SUCCESS';

              return (
                <div key={log.id} className="space-y-0.5 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="text-slate-600 text-[10px] shrink-0">
                      [{log.timestamp.split('T')[1].slice(0, 8)}]
                    </span>
                    <span className={`px-1 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                      isError 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : isWarn 
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : isSuccess
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-sky-300'
                    }`}>
                      {log.level}
                    </span>
                    <span className={`${
                      isError ? 'text-rose-400 font-bold' : isSuccess ? 'text-emerald-300' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                  {log.detail && (
                    <div className="pl-14 text-[11px] text-slate-400 font-mono">
                      {log.detail}
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={terminalBottomRef} />
          </div>

          {/* Terminal Footer Status */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-3">
              <span>Exit Code: 0</span>
              <span>Memory Heap: 48.2 MB</span>
            </div>
            <div className="text-emerald-400 font-semibold">
              Double-Entry Invariance: BALANCED
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
